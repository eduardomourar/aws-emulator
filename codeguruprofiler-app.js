import {
  CodeGuruProfilerClient,
  ListProfilingGroupsCommand,
  CreateProfilingGroupCommand,
  DescribeProfilingGroupCommand,
  DeleteProfilingGroupCommand,
} from "https://esm.sh/@aws-sdk/client-codeguruprofiler@3?target=es2022";

import { InMemoryHttpClient, EmulatorHttpHandler } from "./bridge-common.js";
import { handler as incomingHandler } from "./jco-out-codeguruprofiler/aws_emulator_embedded_codeguruprofiler.js";

const emulator = new InMemoryHttpClient(incomingHandler);

const client = new CodeGuruProfilerClient({
  region: "us-east-1",
  endpoint: "https://codeguru-profiler.local.invalid",
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
  requestHandler: new EmulatorHttpHandler(emulator),
});

const groupsBody = document.getElementById("groups-body");
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

async function refreshGroups() {
  groupsBody.innerHTML = "";
  const row = document.createElement("tr");
  row.className = "empty-row";
  const cell = document.createElement("td");
  cell.colSpan = 4;
  cell.textContent = "Loading…";
  row.appendChild(cell);
  groupsBody.appendChild(row);

  try {
    const { profilingGroups = [] } = await client.send(
      new ListProfilingGroupsCommand({ includeDescription: true }),
    );
    renderGroups(profilingGroups);
    clearStatus();
  } catch (error) {
    groupsBody.innerHTML = "";
    showStatus(`Failed to list profiling groups: ${error.message}`, true);
  }
}

function renderGroups(groups) {
  groupsBody.innerHTML = "";
  if (groups.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No profiling groups yet.";
    row.appendChild(cell);
    groupsBody.appendChild(row);
    return;
  }

  for (const group of groups) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = group.name;
    row.appendChild(nameCell);

    const platformCell = document.createElement("td");
    platformCell.textContent = group.computePlatform || "—";
    row.appendChild(platformCell);

    const arnCell = document.createElement("td");
    arnCell.className = "arn";
    arnCell.textContent = group.arn;
    row.appendChild(arnCell);

    const actionsCell = document.createElement("td");
    actionsCell.className = "row-actions";

    const describeBtn = document.createElement("button");
    describeBtn.type = "button";
    describeBtn.textContent = "Describe";
    describeBtn.addEventListener("click", () => describeGroup(group.name));
    actionsCell.appendChild(describeBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteGroup(group.name));
    actionsCell.appendChild(deleteBtn);

    row.appendChild(actionsCell);
    groupsBody.appendChild(row);
  }
}

async function describeGroup(name) {
  try {
    const { profilingGroup } = await client.send(new DescribeProfilingGroupCommand({ profilingGroupName: name }));
    document.getElementById("describe-title").textContent = `Profiling group details — ${name}`;
    document.getElementById("describe-value").textContent = JSON.stringify(profilingGroup, null, 2);
    describeDialog.showModal();
  } catch (error) {
    showStatus(`Failed to describe "${name}": ${error.message}`, true);
  }
}

async function deleteGroup(name) {
  if (!window.confirm(`Delete profiling group "${name}"?`)) return;
  try {
    await client.send(new DeleteProfilingGroupCommand({ profilingGroupName: name }));
    showStatus(`Deleted profiling group "${name}".`, false);
    await refreshGroups();
  } catch (error) {
    showStatus(`Failed to delete "${name}": ${error.message}`, true);
  }
}

document.getElementById("refresh-btn").addEventListener("click", () => {
  clearStatus();
  refreshGroups();
});

document.getElementById("new-group-btn").addEventListener("click", () => {
  document.getElementById("create-name").value = "";
  createDialog.showModal();
});

document.getElementById("create-cancel").addEventListener("click", () => {
  createDialog.close();
});

document.getElementById("create-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const profilingGroupName = document.getElementById("create-name").value.trim();
  const computePlatform = document.getElementById("create-platform").value;
  if (!profilingGroupName) return;

  try {
    await client.send(
      new CreateProfilingGroupCommand({
        profilingGroupName,
        computePlatform,
        clientToken: crypto.randomUUID(),
      }),
    );
    createDialog.close();
    showStatus(`Created profiling group "${profilingGroupName}".`, false);
    await refreshGroups();
  } catch (error) {
    showStatus(`Failed to create profiling group: ${error.message}`, true);
  }
});

refreshGroups();
