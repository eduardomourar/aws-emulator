import {
  GlacierClient,
  ListVaultsCommand,
  CreateVaultCommand,
  DescribeVaultCommand,
  DeleteVaultCommand,
} from "https://esm.sh/@aws-sdk/client-glacier@3?target=es2022";

import { InMemoryHttpClient, EmulatorHttpHandler } from "./bridge-common.js";
import { handler as incomingHandler } from "./jco-out-glacier/aws_emulator_embedded_glacier.js";

const emulator = new InMemoryHttpClient(incomingHandler);

const client = new GlacierClient({
  region: "us-east-1",
  endpoint: "https://glacier.local.invalid",
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
  requestHandler: new EmulatorHttpHandler(emulator),
});

const vaultsBody = document.getElementById("vaults-body");
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

async function refreshVaults() {
  vaultsBody.innerHTML = "";
  const row = document.createElement("tr");
  row.className = "empty-row";
  const cell = document.createElement("td");
  cell.colSpan = 4;
  cell.textContent = "Loading…";
  row.appendChild(cell);
  vaultsBody.appendChild(row);

  try {
    // Glacier's own convention: "-" names the account the credentials speak for.
    const { VaultList = [] } = await client.send(new ListVaultsCommand({ accountId: "-" }));
    renderVaults(VaultList);
    clearStatus();
  } catch (error) {
    vaultsBody.innerHTML = "";
    showStatus(`Failed to list vaults: ${error.message}`, true);
  }
}

function renderVaults(vaults) {
  vaultsBody.innerHTML = "";
  if (vaults.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No vaults yet.";
    row.appendChild(cell);
    vaultsBody.appendChild(row);
    return;
  }

  for (const vault of vaults) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = vault.VaultName;
    row.appendChild(nameCell);

    const arnCell = document.createElement("td");
    arnCell.className = "arn";
    arnCell.textContent = vault.VaultARN;
    row.appendChild(arnCell);

    const countCell = document.createElement("td");
    countCell.textContent = vault.NumberOfArchives ?? 0;
    row.appendChild(countCell);

    const actionsCell = document.createElement("td");
    actionsCell.className = "row-actions";

    const describeBtn = document.createElement("button");
    describeBtn.type = "button";
    describeBtn.textContent = "Describe";
    describeBtn.addEventListener("click", () => describeVault(vault.VaultName));
    actionsCell.appendChild(describeBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteVault(vault.VaultName));
    actionsCell.appendChild(deleteBtn);

    row.appendChild(actionsCell);
    vaultsBody.appendChild(row);
  }
}

async function describeVault(vaultName) {
  try {
    const details = await client.send(new DescribeVaultCommand({ accountId: "-", vaultName }));
    document.getElementById("describe-title").textContent = `Vault details — ${vaultName}`;
    document.getElementById("describe-value").textContent = JSON.stringify(details, null, 2);
    describeDialog.showModal();
  } catch (error) {
    showStatus(`Failed to describe "${vaultName}": ${error.message}`, true);
  }
}

async function deleteVault(vaultName) {
  if (!window.confirm(`Delete vault "${vaultName}"?`)) return;
  try {
    await client.send(new DeleteVaultCommand({ accountId: "-", vaultName }));
    showStatus(`Deleted vault "${vaultName}".`, false);
    await refreshVaults();
  } catch (error) {
    showStatus(`Failed to delete "${vaultName}": ${error.message}`, true);
  }
}

document.getElementById("refresh-btn").addEventListener("click", () => {
  clearStatus();
  refreshVaults();
});

document.getElementById("new-vault-btn").addEventListener("click", () => {
  document.getElementById("create-name").value = "";
  createDialog.showModal();
});

document.getElementById("create-cancel").addEventListener("click", () => {
  createDialog.close();
});

document.getElementById("create-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const vaultName = document.getElementById("create-name").value.trim();
  if (!vaultName) return;

  try {
    await client.send(new CreateVaultCommand({ accountId: "-", vaultName }));
    createDialog.close();
    showStatus(`Created vault "${vaultName}".`, false);
    await refreshVaults();
  } catch (error) {
    showStatus(`Failed to create vault: ${error.message}`, true);
  }
});

refreshVaults();
