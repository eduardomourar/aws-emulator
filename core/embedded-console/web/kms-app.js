import {
  KMSClient,
  ListKeysCommand,
  CreateKeyCommand,
  DescribeKeyCommand,
  DisableKeyCommand,
  EnableKeyCommand,
  ScheduleKeyDeletionCommand,
} from "https://esm.sh/@aws-sdk/client-kms@3?target=es2022";

import { InMemoryHttpClient, EmulatorHttpHandler } from "./bridge-common.js";
import { handler as incomingHandler } from "./jco-out-kms/aws_emulator_embedded_kms.js";

// Bridges the AWS SDK's HTTP layer straight into the KMS component's own
// `incoming-handler` export — the same component the Secrets Manager page reaches
// indirectly (via its outgoing-handler call), browsed here directly instead.
const emulator = new InMemoryHttpClient(incomingHandler);

const client = new KMSClient({
  region: "us-east-1",
  endpoint: "https://kms.local.invalid",
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
  requestHandler: new EmulatorHttpHandler(emulator),
});

const keysBody = document.getElementById("keys-body");
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

async function refreshKeys() {
  keysBody.innerHTML = "";
  const row = document.createElement("tr");
  row.className = "empty-row";
  const cell = document.createElement("td");
  cell.colSpan = 4;
  cell.textContent = "Loading…";
  row.appendChild(cell);
  keysBody.appendChild(row);

  try {
    const { Keys = [] } = await client.send(new ListKeysCommand({}));
    const described = await Promise.all(
      Keys.map((key) =>
        client
          .send(new DescribeKeyCommand({ KeyId: key.KeyId }))
          .then((r) => r.KeyMetadata)
          .catch(() => ({ KeyId: key.KeyId, Arn: key.KeyArn, Description: "" })),
      ),
    );
    renderKeys(described);
    clearStatus();
  } catch (error) {
    keysBody.innerHTML = "";
    showStatus(`Failed to list keys: ${error.message}`, true);
  }
}

function renderKeys(keys) {
  keysBody.innerHTML = "";
  if (keys.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No keys yet.";
    row.appendChild(cell);
    keysBody.appendChild(row);
    return;
  }

  for (const key of keys) {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = key.KeyId;
    row.appendChild(idCell);

    const arnCell = document.createElement("td");
    arnCell.className = "arn";
    arnCell.textContent = key.Arn;
    row.appendChild(arnCell);

    const descCell = document.createElement("td");
    descCell.textContent = key.Description || "—";
    row.appendChild(descCell);

    const actionsCell = document.createElement("td");
    actionsCell.className = "row-actions";

    const describeBtn = document.createElement("button");
    describeBtn.type = "button";
    describeBtn.textContent = "Describe";
    describeBtn.addEventListener("click", () => describeKey(key.KeyId));
    actionsCell.appendChild(describeBtn);

    const toggleBtn = document.createElement("button");
    const enabled = key.KeyState === "Enabled";
    toggleBtn.type = "button";
    toggleBtn.textContent = enabled ? "Disable" : "Enable";
    toggleBtn.addEventListener("click", () => toggleKey(key.KeyId, enabled));
    actionsCell.appendChild(toggleBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Schedule deletion";
    deleteBtn.addEventListener("click", () => scheduleDeletion(key.KeyId));
    actionsCell.appendChild(deleteBtn);

    row.appendChild(actionsCell);
    keysBody.appendChild(row);
  }
}

async function describeKey(keyId) {
  try {
    const { KeyMetadata } = await client.send(new DescribeKeyCommand({ KeyId: keyId }));
    document.getElementById("describe-title").textContent = `Key details — ${keyId}`;
    document.getElementById("describe-value").textContent = JSON.stringify(KeyMetadata, null, 2);
    describeDialog.showModal();
  } catch (error) {
    showStatus(`Failed to describe "${keyId}": ${error.message}`, true);
  }
}

async function toggleKey(keyId, currentlyEnabled) {
  try {
    const command = currentlyEnabled ? new DisableKeyCommand({ KeyId: keyId }) : new EnableKeyCommand({ KeyId: keyId });
    await client.send(command);
    showStatus(`${currentlyEnabled ? "Disabled" : "Enabled"} "${keyId}".`, false);
    await refreshKeys();
  } catch (error) {
    showStatus(`Failed to update "${keyId}": ${error.message}`, true);
  }
}

async function scheduleDeletion(keyId) {
  if (!window.confirm(`Schedule "${keyId}" for deletion?`)) return;
  try {
    await client.send(new ScheduleKeyDeletionCommand({ KeyId: keyId, PendingWindowInDays: 7 }));
    showStatus(`Scheduled "${keyId}" for deletion.`, false);
    await refreshKeys();
  } catch (error) {
    showStatus(`Failed to schedule deletion for "${keyId}": ${error.message}`, true);
  }
}

document.getElementById("refresh-btn").addEventListener("click", () => {
  clearStatus();
  refreshKeys();
});

document.getElementById("new-key-btn").addEventListener("click", () => {
  document.getElementById("create-description").value = "";
  createDialog.showModal();
});

document.getElementById("create-cancel").addEventListener("click", () => {
  createDialog.close();
});

document.getElementById("create-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const description = document.getElementById("create-description").value.trim();

  try {
    const { KeyMetadata } = await client.send(new CreateKeyCommand({ Description: description || undefined }));
    createDialog.close();
    showStatus(`Created key "${KeyMetadata.KeyId}".`, false);
    await refreshKeys();
  } catch (error) {
    showStatus(`Failed to create key: ${error.message}`, true);
  }
});

refreshKeys();
