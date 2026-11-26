// SPDX-License-Identifier: CC0-1.0

// Answers `POST /api/ec2/vpc-wizard` — a route floci-ui's own `routes/ec2.ts`
// never wires up in this embedded build (confirmed: neither `ec2.js` nor
// `networking.js`'s own bundled Hono app has ANY route naming "vpc-wizard",
// though both bundle a fully-coded `createVpcWizard` ADAPTER METHOD; nothing
// in this build ever calls it). The frontend already calls this exact path
// with this exact request/response shape — `NetworkingPanel-*.js`'s own VPC
// Wizard modal — so this file answers to THAT contract, reimplemented from
// scratch over `ec2-query-client.js` rather than floci-ui's own adapter
// method, which this embedded build has no way to reach from outside its own
// bundle. The subnet-CIDR math (`parseCidr`/`fitsWithin`/`validatePlan`/
// `allocateSubnetCidrs`) and the create order are ported from that same
// adapter method's own source (readable straight out of the committed
// `networking.js`, which this build never strips of its own helper
// functions) to answer identically.
//
// `natGateway` is accepted on the request (the real adapter method supports
// it) but never acted on: `NetworkingPanel-*.js`'s own VPC Wizard form always
// sends `natGateway: false` — it exposes no toggle for it — so implementing
// NAT Gateway creation, Elastic IP allocation and the private route table
// that goes with them would be dead code for every caller this build has.

import { ec2Call, textOf, Ec2Error } from "./ec2-query-client.js";

function parseCidr(cidr) {
  const match = cidr.trim().match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/);
  if (!match) return null;
  const octets = match.slice(1, 5).map(Number);
  const prefix = Number(match[5]);
  if (octets.some((o) => o > 255) || prefix < 0 || prefix > 32) return null;
  const address = octets[0] * 16777216 + octets[1] * 65536 + octets[2] * 256 + octets[3];
  const size = 2 ** (32 - prefix);
  return { address, network: Math.floor(address / size) * size, prefix };
}

function fitsWithin(inner, outer) {
  const a = parseCidr(inner), b = parseCidr(outer);
  if (!a || !b || a.prefix < b.prefix) return false;
  const innerSize = 2 ** (32 - a.prefix), outerSize = 2 ** (32 - b.prefix);
  return a.network >= b.network && a.network + innerSize <= b.network + outerSize;
}

/** `null` when `vpcCidr`/`subnetGroups` is a valid plan; the refusal reason otherwise. */
function validatePlan(vpcCidr, subnetGroups) {
  const vpc = parseCidr(vpcCidr);
  if (!vpc) return `Invalid VPC CIDR ${vpcCidr}`;
  if (vpc.address !== vpc.network) return `VPC CIDR ${vpcCidr} is not a network address`;
  if (vpc.prefix < 16 || vpc.prefix > 28) return "VPC CIDR prefix must be between /16 and /28";
  if (subnetGroups.length === 0) return "At least one subnet group is required";
  let used = 0;
  for (const group of subnetGroups) {
    const prefix = group.prefix ?? Math.min(vpc.prefix + 4, 28);
    if (!Number.isInteger(group.count) || group.count < 1) return `Subnet group ${group.name} must contain at least one subnet`;
    if (!Number.isInteger(prefix) || prefix < vpc.prefix || prefix > 28) return `Subnet group ${group.name} has an invalid prefix /${prefix}`;
    used += group.count * 2 ** (32 - prefix);
    if (used > 2 ** (32 - vpc.prefix)) return `Requested subnet plan does not fit within VPC CIDR ${vpcCidr}`;
  }
  for (const cidrs of allocateSubnetCidrs(vpcCidr, subnetGroups)) {
    for (const cidr of cidrs) {
      const parsed = parseCidr(cidr);
      if (!parsed || parsed.address !== parsed.network || !fitsWithin(cidr, vpcCidr)) {
        return `Requested subnet ${cidr} does not fit within VPC CIDR ${vpcCidr}`;
      }
    }
  }
  return null;
}

/** One CIDR block list per subnet group, allocated sequentially from the start of `vpcCidr`. */
function allocateSubnetCidrs(vpcCidr, subnetGroups) {
  const vpc = parseCidr(vpcCidr);
  const defaultPrefix = Math.min(vpc.prefix + 4, 28);
  function render(address, prefix) {
    return `${Math.floor(address / 16777216)}.${Math.floor((address % 16777216) / 65536)}.${Math.floor((address % 65536) / 256)}.${address % 256}/${prefix}`;
  }
  let next = vpc.network;
  return subnetGroups.map((group) => {
    const prefix = group.prefix ?? defaultPrefix;
    const size = 2 ** (32 - prefix);
    const cidrs = Array.from({ length: group.count }, (_, i) => render(next + i * size, prefix));
    next += group.count * size;
    return cidrs;
  });
}

async function tag(resourceId, name) {
  await ec2Call("CreateTags", { ResourceId: [resourceId], Tag: [{ Key: "Name", Value: name }] });
}

export async function handleVpcWizardRequest(request) {
  const { name, cidrBlock, subnetGroups, availabilityZone } = await request.json();
  const invalidReason = validatePlan(cidrBlock, subnetGroups);
  if (invalidReason) {
    return new Response(JSON.stringify({ message: invalidReason }), { status: 400, headers: { "content-type": "application/json" } });
  }

  // Every created resource, in creation order, so a failure partway through
  // rolls back everything already created, newest first — the same rollback
  // the real adapter method does, so a failed wizard run never leaves a
  // half-built VPC behind for the console's next refresh to show.
  const rollback = [];
  async function rollItAllBack() {
    for (const undo of rollback.reverse()) {
      try {
        await undo();
      } catch (error) {
        console.warn("Failed to roll back a VPC Wizard step", error);
      }
    }
  }

  try {
    const vpcDoc = await ec2Call("CreateVpc", { CidrBlock: cidrBlock });
    const vpcId = textOf(vpcDoc, "vpcId");
    rollback.push(() => ec2Call("DeleteVpc", { VpcId: vpcId }));
    await tag(vpcId, name);

    const igwDoc = await ec2Call("CreateInternetGateway", {});
    const igwId = textOf(igwDoc, "internetGatewayId");
    rollback.push(() => ec2Call("DeleteInternetGateway", { InternetGatewayId: igwId }));
    await tag(igwId, `${name}-igw`);
    await ec2Call("AttachInternetGateway", { InternetGatewayId: igwId, VpcId: vpcId });
    rollback.push(() => ec2Call("DetachInternetGateway", { InternetGatewayId: igwId, VpcId: vpcId }));

    const cidrsByGroup = allocateSubnetCidrs(cidrBlock, subnetGroups);
    const groups = [];
    for (let g = 0; g < subnetGroups.length; g++) {
      const group = subnetGroups[g];
      const subnetIds = [];
      for (let i = 0; i < group.count; i++) {
        const subnetDoc = await ec2Call("CreateSubnet", {
          VpcId: vpcId,
          CidrBlock: cidrsByGroup[g][i],
          AvailabilityZone: group.az || availabilityZone || undefined,
        });
        const subnetId = textOf(subnetDoc, "subnetId");
        rollback.push(() => ec2Call("DeleteSubnet", { SubnetId: subnetId }));
        await tag(subnetId, `${name}-${group.name}-${i + 1}`);
        subnetIds.push(subnetId);
      }
      groups.push({ name: group.name, isPublic: group.isPublic, subnetIds });
    }

    const publicSubnetIds = groups.filter((g) => g.isPublic).flatMap((g) => g.subnetIds);
    const privateSubnetIds = groups.filter((g) => !g.isPublic).flatMap((g) => g.subnetIds);

    const routeTableDoc = await ec2Call("CreateRouteTable", { VpcId: vpcId });
    const publicRouteTableId = textOf(routeTableDoc, "routeTableId");
    rollback.push(() => ec2Call("DeleteRouteTable", { RouteTableId: publicRouteTableId }));
    await tag(publicRouteTableId, `${name}-pub-rtb`);

    if (publicSubnetIds.length > 0) {
      await ec2Call("CreateRoute", { RouteTableId: publicRouteTableId, DestinationCidrBlock: "0.0.0.0/0", GatewayId: igwId });
      for (const subnetId of publicSubnetIds) {
        const associationDoc = await ec2Call("AssociateRouteTable", { RouteTableId: publicRouteTableId, SubnetId: subnetId });
        const associationId = textOf(associationDoc, "associationId");
        if (associationId) rollback.push(() => ec2Call("DisassociateRouteTable", { AssociationId: associationId }));
      }
    }

    return new Response(
      JSON.stringify({ vpcId, igwId, publicRouteTableId, publicSubnetIds, privateSubnetIds, subnetGroups: groups }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  } catch (error) {
    await rollItAllBack();
    const message = error instanceof Ec2Error ? error.message : String(error?.message ?? error);
    return new Response(JSON.stringify({ message }), { status: 502, headers: { "content-type": "application/json" } });
  }
}
