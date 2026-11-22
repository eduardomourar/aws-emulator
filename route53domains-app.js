import {
  Route53DomainsClient,
  ListDomainsCommand,
  GetDomainDetailCommand,
  RegisterDomainCommand,
  DeleteDomainCommand,
} from "https://esm.sh/@aws-sdk/client-route-53-domains@3?target=es2022";

import { InMemoryHttpClient, EmulatorHttpHandler } from "./bridge-common.js";
import { handler as incomingHandler } from "./jco-out-route53domains/aws_emulator_embedded_route53domains.js";

const emulator = new InMemoryHttpClient(incomingHandler);

const client = new Route53DomainsClient({
  region: "us-east-1",
  endpoint: "https://route53domains.local.invalid",
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
  requestHandler: new EmulatorHttpHandler(emulator),
});

const domainsBody = document.getElementById("domains-body");
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

async function refreshDomains() {
  domainsBody.innerHTML = "";
  const row = document.createElement("tr");
  row.className = "empty-row";
  const cell = document.createElement("td");
  cell.colSpan = 4;
  cell.textContent = "Loading…";
  row.appendChild(cell);
  domainsBody.appendChild(row);

  try {
    const { Domains = [] } = await client.send(new ListDomainsCommand({}));
    renderDomains(Domains);
    clearStatus();
  } catch (error) {
    domainsBody.innerHTML = "";
    showStatus(`Failed to list domains: ${error.message}`, true);
  }
}

function renderDomains(domains) {
  domainsBody.innerHTML = "";
  if (domains.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No domains yet.";
    row.appendChild(cell);
    domainsBody.appendChild(row);
    return;
  }

  for (const domain of domains) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = domain.DomainName;
    row.appendChild(nameCell);

    const renewCell = document.createElement("td");
    renewCell.textContent = domain.AutoRenew ? "Yes" : "No";
    row.appendChild(renewCell);

    const expiryCell = document.createElement("td");
    expiryCell.textContent = domain.Expiry ? new Date(domain.Expiry).toLocaleDateString() : "—";
    row.appendChild(expiryCell);

    const actionsCell = document.createElement("td");
    actionsCell.className = "row-actions";

    const describeBtn = document.createElement("button");
    describeBtn.type = "button";
    describeBtn.textContent = "Describe";
    describeBtn.addEventListener("click", () => describeDomain(domain.DomainName));
    actionsCell.appendChild(describeBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteDomain(domain.DomainName));
    actionsCell.appendChild(deleteBtn);

    row.appendChild(actionsCell);
    domainsBody.appendChild(row);
  }
}

async function describeDomain(domainName) {
  try {
    const details = await client.send(new GetDomainDetailCommand({ DomainName: domainName }));
    document.getElementById("describe-title").textContent = `Domain details — ${domainName}`;
    document.getElementById("describe-value").textContent = JSON.stringify(details, null, 2);
    describeDialog.showModal();
  } catch (error) {
    showStatus(`Failed to describe "${domainName}": ${error.message}`, true);
  }
}

async function deleteDomain(domainName) {
  if (!window.confirm(`Delete "${domainName}"?`)) return;
  try {
    await client.send(new DeleteDomainCommand({ DomainName: domainName }));
    showStatus(`Deleted "${domainName}".`, false);
    await refreshDomains();
  } catch (error) {
    showStatus(`Failed to delete "${domainName}": ${error.message}`, true);
  }
}

document.getElementById("refresh-btn").addEventListener("click", () => {
  clearStatus();
  refreshDomains();
});

document.getElementById("new-domain-btn").addEventListener("click", () => {
  document.getElementById("create-form").reset();
  document.getElementById("contact-country").value = "US";
  createDialog.showModal();
});

document.getElementById("create-cancel").addEventListener("click", () => {
  createDialog.close();
});

document.getElementById("create-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const domainName = document.getElementById("create-domain-name").value.trim();
  const durationInYears = Number(document.getElementById("create-duration").value);

  const contact = {
    FirstName: document.getElementById("contact-first-name").value.trim(),
    LastName: document.getElementById("contact-last-name").value.trim(),
    ContactType: "PERSON",
    Email: document.getElementById("contact-email").value.trim(),
    PhoneNumber: document.getElementById("contact-phone").value.trim(),
    AddressLine1: document.getElementById("contact-address").value.trim(),
    City: document.getElementById("contact-city").value.trim(),
    State: document.getElementById("contact-state").value.trim(),
    CountryCode: document.getElementById("contact-country").value.trim().toUpperCase(),
    ZipCode: document.getElementById("contact-zip").value.trim(),
  };
  if (!domainName || !contact.FirstName || !contact.LastName) return;

  try {
    await client.send(
      new RegisterDomainCommand({
        DomainName: domainName,
        DurationInYears: durationInYears,
        AdminContact: contact,
        RegistrantContact: contact,
        TechContact: contact,
      }),
    );
    createDialog.close();
    showStatus(`Registered "${domainName}".`, false);
    await refreshDomains();
  } catch (error) {
    showStatus(`Failed to register "${domainName}": ${error.message}`, true);
  }
});

refreshDomains();
