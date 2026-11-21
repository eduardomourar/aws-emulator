import {
  SecretsManagerClient,
  ListSecretsCommand,
  CreateSecretCommand,
  GetSecretValueCommand,
  PutSecretValueCommand,
  DeleteSecretCommand,
} from "https://esm.sh/@aws-sdk/client-secrets-manager@3?target=es2022";

import { InMemoryHttpClient, EmulatorHttpHandler } from "./bridge-common.js";
import { incomingHandler } from "./jco-out-secretsmanager/aws_emulator_embedded_secretsmanager.js";
// Side-effect import: patches `globalThis.fetch` so this component's
// `wasi:http/outgoing-handler`-driven calls (to KMS directly, and to IAM via
// `embedded-console-service`'s relay) route into those components instead of
// hitting the real network. Must load before any secretsmanager call.
import "./external-dispatch-bridge.js";

// Bridges the AWS SDK's HTTP layer straight into the wasi:http component's
// `incoming-handler` export — no network call ever leaves this page.
const emulator = new InMemoryHttpClient(incomingHandler);

const client = new SecretsManagerClient({
  region: "us-east-1",
  endpoint: "https://secretsmanager.local.invalid",
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
  requestHandler: new EmulatorHttpHandler(emulator),
});

const secretsBody = document.getElementById("secrets-body");
const statusEl = document.getElementById("status");
const createDialog = document.getElementById("create-dialog");
const viewDialog = document.getElementById("view-dialog");

function showStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.className = `status ${isError ? "error" : "ok"}`;
  statusEl.hidden = false;
}

function clearStatus() {
  statusEl.hidden = true;
}

async function refreshSecrets() {
  secretsBody.innerHTML = "";
  const row = document.createElement("tr");
  row.className = "empty-row";
  const cell = document.createElement("td");
  cell.colSpan = 4;
  cell.textContent = "Loading…";
  row.appendChild(cell);
  secretsBody.appendChild(row);

  try {
    const { SecretList = [] } = await client.send(new ListSecretsCommand({}));
    renderSecrets(SecretList);
    clearStatus();
  } catch (error) {
    secretsBody.innerHTML = "";
    showStatus(`Failed to list secrets: ${error.message}`, true);
  }
}

function renderSecrets(secrets) {
  secretsBody.innerHTML = "";
  if (secrets.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No secrets yet.";
    row.appendChild(cell);
    secretsBody.appendChild(row);
    return;
  }

  for (const secret of secrets) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = secret.Name;
    row.appendChild(nameCell);

    const arnCell = document.createElement("td");
    arnCell.className = "arn";
    arnCell.textContent = secret.ARN;
    row.appendChild(arnCell);

    const changedCell = document.createElement("td");
    changedCell.textContent = secret.LastChangedDate
      ? new Date(secret.LastChangedDate).toLocaleString()
      : "—";
    row.appendChild(changedCell);

    const actionsCell = document.createElement("td");
    actionsCell.className = "row-actions";

    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.textContent = "View value";
    viewBtn.addEventListener("click", () => viewSecret(secret.Name));
    actionsCell.appendChild(viewBtn);

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit value";
    editBtn.addEventListener("click", () => editSecret(secret.Name));
    actionsCell.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteSecret(secret.Name));
    actionsCell.appendChild(deleteBtn);

    row.appendChild(actionsCell);
    secretsBody.appendChild(row);
  }
}

async function viewSecret(name) {
  try {
    const result = await client.send(new GetSecretValueCommand({ SecretId: name }));
    document.getElementById("view-title").textContent = `Secret value — ${name}`;
    document.getElementById("view-value").textContent =
      result.SecretString ?? "(binary secret)";
    viewDialog.showModal();
  } catch (error) {
    showStatus(`Failed to read "${name}": ${error.message}`, true);
  }
}

async function editSecret(name) {
  const value = window.prompt(`New value for "${name}":`);
  if (value == null) return;
  try {
    await client.send(new PutSecretValueCommand({ SecretId: name, SecretString: value }));
    showStatus(`Updated "${name}".`, false);
  } catch (error) {
    showStatus(`Failed to update "${name}": ${error.message}`, true);
  }
}

async function deleteSecret(name) {
  if (!window.confirm(`Delete secret "${name}"? This cannot be undone.`)) return;
  try {
    await client.send(
      new DeleteSecretCommand({ SecretId: name, ForceDeleteWithoutRecovery: true }),
    );
    showStatus(`Deleted "${name}".`, false);
    await refreshSecrets();
  } catch (error) {
    showStatus(`Failed to delete "${name}": ${error.message}`, true);
  }
}

document.getElementById("refresh-btn").addEventListener("click", () => {
  clearStatus();
  refreshSecrets();
});

document.getElementById("new-secret-btn").addEventListener("click", () => {
  document.getElementById("create-name").value = "";
  document.getElementById("create-value").value = "";
  createDialog.showModal();
});

document.getElementById("create-cancel").addEventListener("click", () => {
  createDialog.close();
});

document.getElementById("create-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("create-name").value.trim();
  const value = document.getElementById("create-value").value;
  if (!name) return;

  try {
    await client.send(new CreateSecretCommand({ Name: name, SecretString: value }));
    createDialog.close();
    showStatus(`Created "${name}".`, false);
    await refreshSecrets();
  } catch (error) {
    showStatus(`Failed to create "${name}": ${error.message}`, true);
  }
});

refreshSecrets();
