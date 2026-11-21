import {
  IAMClient,
  ListUsersCommand,
  CreateUserCommand,
  GetUserCommand,
  DeleteUserCommand,
} from "https://esm.sh/@aws-sdk/client-iam@3?target=es2022";

import { InMemoryHttpClient, EmulatorHttpHandler } from "./bridge-common.js";
import { incomingHandler } from "./jco-out-iam/aws_emulator_embedded_iam.js";

const emulator = new InMemoryHttpClient(incomingHandler);

const client = new IAMClient({
  region: "us-east-1",
  endpoint: "https://iam.local.invalid",
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
  requestHandler: new EmulatorHttpHandler(emulator),
});

const usersBody = document.getElementById("users-body");
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

async function refreshUsers() {
  usersBody.innerHTML = "";
  const row = document.createElement("tr");
  row.className = "empty-row";
  const cell = document.createElement("td");
  cell.colSpan = 4;
  cell.textContent = "Loading…";
  row.appendChild(cell);
  usersBody.appendChild(row);

  try {
    const { Users = [] } = await client.send(new ListUsersCommand({}));
    renderUsers(Users);
    clearStatus();
  } catch (error) {
    usersBody.innerHTML = "";
    showStatus(`Failed to list users: ${error.message}`, true);
  }
}

function renderUsers(users) {
  usersBody.innerHTML = "";
  if (users.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No users yet.";
    row.appendChild(cell);
    usersBody.appendChild(row);
    return;
  }

  for (const user of users) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = user.UserName;
    row.appendChild(nameCell);

    const arnCell = document.createElement("td");
    arnCell.className = "arn";
    arnCell.textContent = user.Arn;
    row.appendChild(arnCell);

    const createdCell = document.createElement("td");
    createdCell.textContent = user.CreateDate ? new Date(user.CreateDate).toLocaleString() : "—";
    row.appendChild(createdCell);

    const actionsCell = document.createElement("td");
    actionsCell.className = "row-actions";

    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.textContent = "View";
    viewBtn.addEventListener("click", () => viewUser(user.UserName));
    actionsCell.appendChild(viewBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteUser(user.UserName));
    actionsCell.appendChild(deleteBtn);

    row.appendChild(actionsCell);
    usersBody.appendChild(row);
  }
}

async function viewUser(name) {
  try {
    const { User } = await client.send(new GetUserCommand({ UserName: name }));
    document.getElementById("view-title").textContent = `User details — ${name}`;
    document.getElementById("view-value").textContent = JSON.stringify(User, null, 2);
    viewDialog.showModal();
  } catch (error) {
    showStatus(`Failed to read "${name}": ${error.message}`, true);
  }
}

async function deleteUser(name) {
  if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
  try {
    await client.send(new DeleteUserCommand({ UserName: name }));
    showStatus(`Deleted "${name}".`, false);
    await refreshUsers();
  } catch (error) {
    showStatus(`Failed to delete "${name}": ${error.message}`, true);
  }
}

document.getElementById("refresh-btn").addEventListener("click", () => {
  clearStatus();
  refreshUsers();
});

document.getElementById("new-user-btn").addEventListener("click", () => {
  document.getElementById("create-name").value = "";
  createDialog.showModal();
});

document.getElementById("create-cancel").addEventListener("click", () => {
  createDialog.close();
});

document.getElementById("create-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("create-name").value.trim();
  if (!name) return;

  try {
    await client.send(new CreateUserCommand({ UserName: name }));
    createDialog.close();
    showStatus(`Created "${name}".`, false);
    await refreshUsers();
  } catch (error) {
    showStatus(`Failed to create "${name}": ${error.message}`, true);
  }
});

refreshUsers();
