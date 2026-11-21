import {
  SecretsManagerClient,
  ListSecretsCommand,
  CreateSecretCommand,
  GetSecretValueCommand,
  DeleteSecretCommand,
} from "https://esm.sh/@aws-sdk/client-secrets-manager@3?target=es2022";

import { InMemoryHttpClient } from "./vendor/preview2-shim/in-memory-http.js";
import { incomingHandler } from "./jco-out/secretsmanager-emulator.js";

// Bridges the AWS SDK's HTTP layer straight into the wasi:http component's
// `incoming-handler` export — no network call ever leaves this page.
const emulator = new InMemoryHttpClient(incomingHandler);

class EmulatorHttpHandler {
  async handle(request) {
    const response = await emulator.fetch(toFetchRequest(request));
    const body = new Uint8Array(await response.arrayBuffer());
    const headers = {};
    for (const [name, value] of response.headers.entries()) {
      headers[name] = value;
    }
    return {
      response: { statusCode: response.status, headers, body },
    };
  }

  updateHttpClientConfig() {}

  httpHandlerConfigs() {
    return {};
  }
}

function toFetchRequest(request) {
  const protocol = request.protocol || "https:";
  const host = request.hostname + (request.port ? `:${request.port}` : "");
  const query = buildQueryString(request.query);
  const url = `${protocol}//${host}${request.path || "/"}${query}`;

  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers || {})) {
    if (value != null) headers.set(name, String(value));
  }

  const init = { method: request.method, headers };
  if (request.body != null && request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }
  return new Request(url, init);
}

function buildQueryString(query) {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const v of value) params.append(name, v);
    } else if (value != null) {
      params.append(name, value);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

const client = new SecretsManagerClient({
  region: "us-east-1",
  endpoint: "https://secretsmanager.local.invalid",
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
  requestHandler: new EmulatorHttpHandler(),
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
