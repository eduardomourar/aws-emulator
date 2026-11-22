import {
  STSClient,
  GetCallerIdentityCommand,
  GetSessionTokenCommand,
} from "https://esm.sh/@aws-sdk/client-sts@3?target=es2022";

import { InMemoryHttpClient, EmulatorHttpHandler } from "./bridge-common.js";
import { handler as incomingHandler } from "./jco-out-sts/aws_emulator_embedded_sts.js";

const emulator = new InMemoryHttpClient(incomingHandler);

const client = new STSClient({
  region: "us-east-1",
  endpoint: "https://sts.local.invalid",
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
  requestHandler: new EmulatorHttpHandler(emulator),
});

const statusEl = document.getElementById("status");
const whoamiValue = document.getElementById("whoami-value");
const sessionsBody = document.getElementById("sessions-body");
const sessionDialog = document.getElementById("session-dialog");
const sessions = [];

function showStatus(message, isError) {
  statusEl.textContent = message;
  statusEl.className = `status ${isError ? "error" : "ok"}`;
  statusEl.hidden = false;
}

function clearStatus() {
  statusEl.hidden = true;
}

async function whoami() {
  try {
    const identity = await client.send(new GetCallerIdentityCommand({}));
    whoamiValue.textContent = JSON.stringify(
      { Account: identity.Account, Arn: identity.Arn, UserId: identity.UserId },
      null,
      2,
    );
    clearStatus();
  } catch (error) {
    showStatus(`Failed to get caller identity: ${error.message}`, true);
  }
}

function renderSessions() {
  sessionsBody.innerHTML = "";
  if (sessions.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.textContent = "No session tokens minted yet.";
    row.appendChild(cell);
    sessionsBody.appendChild(row);
    return;
  }

  for (const session of sessions) {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = session.AccessKeyId;
    row.appendChild(idCell);

    const expCell = document.createElement("td");
    expCell.textContent = session.Expiration ? new Date(session.Expiration).toLocaleString() : "—";
    row.appendChild(expCell);

    const actionsCell = document.createElement("td");
    actionsCell.className = "row-actions";
    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.textContent = "View";
    viewBtn.addEventListener("click", () => {
      document.getElementById("session-title").textContent = `Session — ${session.AccessKeyId}`;
      document.getElementById("session-value").textContent = JSON.stringify(session, null, 2);
      sessionDialog.showModal();
    });
    actionsCell.appendChild(viewBtn);
    row.appendChild(actionsCell);

    sessionsBody.appendChild(row);
  }
}

async function getSessionToken() {
  try {
    const { Credentials } = await client.send(new GetSessionTokenCommand({}));
    sessions.unshift(Credentials);
    renderSessions();
    showStatus(`Minted session token "${Credentials.AccessKeyId}".`, false);
  } catch (error) {
    showStatus(`Failed to get session token: ${error.message}`, true);
  }
}

document.getElementById("whoami-btn").addEventListener("click", () => {
  clearStatus();
  whoami();
});

document.getElementById("new-session-btn").addEventListener("click", () => {
  clearStatus();
  getSessionToken();
});

renderSessions();
