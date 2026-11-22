import {
  DLMClient,
  GetLifecyclePoliciesCommand,
  GetLifecyclePolicyCommand,
  CreateLifecyclePolicyCommand,
  UpdateLifecyclePolicyCommand,
  DeleteLifecyclePolicyCommand,
} from "https://esm.sh/@aws-sdk/client-dlm@3?target=es2022";

import { InMemoryHttpClient, EmulatorHttpHandler } from "./bridge-common.js";
import { handler as incomingHandler } from "./jco-out-dlm/aws_emulator_embedded_dlm.js";

const emulator = new InMemoryHttpClient(incomingHandler);

const client = new DLMClient({
  region: "us-east-1",
  endpoint: "https://dlm.local.invalid",
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
  requestHandler: new EmulatorHttpHandler(emulator),
});

const policiesBody = document.getElementById("policies-body");
const statusEl = document.getElementById("status");
const createDialog = document.getElementById("create-dialog");
const describeDialog = document.getElementById("describe-dialog");

function showStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.className = `status ${isError ? "error" : "ok"}`;
  statusEl.hidden = false;
}

function clearStatus() {
  statusEl.hidden = true;
}

async function refreshPolicies() {
  policiesBody.innerHTML = "";
  const row = document.createElement("tr");
  row.className = "empty-row";
  const cell = document.createElement("td");
  cell.colSpan = 4;
  cell.textContent = "Loading…";
  row.appendChild(cell);
  policiesBody.appendChild(row);

  try {
    const { Policies = [] } = await client.send(new GetLifecyclePoliciesCommand({}));
    renderPolicies(Policies);
    clearStatus();
  } catch (error) {
    policiesBody.innerHTML = "";
    showStatus(`Failed to list policies: ${error.message}`, true);
  }
}

function renderPolicies(policies) {
  policiesBody.innerHTML = "";
  if (policies.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No lifecycle policies yet.";
    row.appendChild(cell);
    policiesBody.appendChild(row);
    return;
  }

  for (const policy of policies) {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = policy.PolicyId;
    row.appendChild(idCell);

    const descCell = document.createElement("td");
    descCell.textContent = policy.Description || "—";
    row.appendChild(descCell);

    const stateCell = document.createElement("td");
    stateCell.textContent = policy.State;
    row.appendChild(stateCell);

    const actionsCell = document.createElement("td");
    actionsCell.className = "row-actions";

    const describeBtn = document.createElement("button");
    describeBtn.type = "button";
    describeBtn.textContent = "Describe";
    describeBtn.addEventListener("click", () => describePolicy(policy.PolicyId));
    actionsCell.appendChild(describeBtn);

    const toggleBtn = document.createElement("button");
    const enabled = policy.State === "ENABLED";
    toggleBtn.type = "button";
    toggleBtn.textContent = enabled ? "Disable" : "Enable";
    toggleBtn.addEventListener("click", () => togglePolicy(policy.PolicyId, enabled));
    actionsCell.appendChild(toggleBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deletePolicy(policy.PolicyId));
    actionsCell.appendChild(deleteBtn);

    row.appendChild(actionsCell);
    policiesBody.appendChild(row);
  }
}

async function describePolicy(policyId) {
  try {
    const { Policy } = await client.send(new GetLifecyclePolicyCommand({ PolicyId: policyId }));
    document.getElementById("describe-title").textContent = `Policy details — ${policyId}`;
    document.getElementById("describe-value").textContent = JSON.stringify(Policy, null, 2);
    describeDialog.showModal();
  } catch (error) {
    showStatus(`Failed to describe "${policyId}": ${error.message}`, true);
  }
}

async function togglePolicy(policyId, currentlyEnabled) {
  try {
    await client.send(
      new UpdateLifecyclePolicyCommand({
        PolicyId: policyId,
        State: currentlyEnabled ? "DISABLED" : "ENABLED",
      }),
    );
    showStatus(`${currentlyEnabled ? "Disabled" : "Enabled"} "${policyId}".`, false);
    await refreshPolicies();
  } catch (error) {
    showStatus(`Failed to update "${policyId}": ${error.message}`, true);
  }
}

async function deletePolicy(policyId) {
  if (!window.confirm(`Delete policy "${policyId}"?`)) return;
  try {
    await client.send(new DeleteLifecyclePolicyCommand({ PolicyId: policyId }));
    showStatus(`Deleted policy "${policyId}".`, false);
    await refreshPolicies();
  } catch (error) {
    showStatus(`Failed to delete "${policyId}": ${error.message}`, true);
  }
}

document.getElementById("refresh-btn").addEventListener("click", () => {
  clearStatus();
  refreshPolicies();
});

document.getElementById("new-policy-btn").addEventListener("click", () => {
  document.getElementById("create-description").value = "";
  createDialog.showModal();
});

document.getElementById("create-cancel").addEventListener("click", () => {
  createDialog.close();
});

document.getElementById("create-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const description = document.getElementById("create-description").value.trim();
  const executionRoleArn = document.getElementById("create-role-arn").value.trim();
  const defaultPolicy = document.getElementById("create-default-policy").value;
  if (!description || !executionRoleArn) return;

  try {
    const { PolicyId } = await client.send(
      new CreateLifecyclePolicyCommand({
        ExecutionRoleArn: executionRoleArn,
        Description: description,
        State: "ENABLED",
        DefaultPolicy: defaultPolicy,
      }),
    );
    createDialog.close();
    showStatus(`Created policy "${PolicyId}".`, false);
    await refreshPolicies();
  } catch (error) {
    showStatus(`Failed to create policy: ${error.message}`, true);
  }
});

refreshPolicies();
