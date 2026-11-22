import {
  BudgetsClient,
  DescribeBudgetsCommand,
  DescribeBudgetCommand,
  CreateBudgetCommand,
  DeleteBudgetCommand,
} from "https://esm.sh/@aws-sdk/client-budgets@3?target=es2022";

import { InMemoryHttpClient, EmulatorHttpHandler } from "./bridge-common.js";
import { handler as incomingHandler } from "./jco-out-budgets/aws_emulator_embedded_budgets.js";

// Budgets answers for exactly one account: the emulator's own canonical
// placeholder id, never a caller-supplied one.
const ACCOUNT_ID = "000000000000";

const emulator = new InMemoryHttpClient(incomingHandler);

const client = new BudgetsClient({
  region: "us-east-1",
  endpoint: "https://budgets.local.invalid",
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
  requestHandler: new EmulatorHttpHandler(emulator),
});

const budgetsBody = document.getElementById("budgets-body");
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

async function refreshBudgets() {
  budgetsBody.innerHTML = "";
  const row = document.createElement("tr");
  row.className = "empty-row";
  const cell = document.createElement("td");
  cell.colSpan = 4;
  cell.textContent = "Loading…";
  row.appendChild(cell);
  budgetsBody.appendChild(row);

  try {
    const { Budgets = [] } = await client.send(new DescribeBudgetsCommand({ AccountId: ACCOUNT_ID }));
    renderBudgets(Budgets);
    clearStatus();
  } catch (error) {
    budgetsBody.innerHTML = "";
    showStatus(`Failed to list budgets: ${error.message}`, true);
  }
}

function renderBudgets(budgets) {
  budgetsBody.innerHTML = "";
  if (budgets.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No budgets yet.";
    row.appendChild(cell);
    budgetsBody.appendChild(row);
    return;
  }

  for (const budget of budgets) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = budget.BudgetName;
    row.appendChild(nameCell);

    const limitCell = document.createElement("td");
    limitCell.textContent = budget.BudgetLimit ? `${budget.BudgetLimit.Amount} ${budget.BudgetLimit.Unit}` : "—";
    row.appendChild(limitCell);

    const unitCell = document.createElement("td");
    unitCell.textContent = budget.TimeUnit;
    row.appendChild(unitCell);

    const actionsCell = document.createElement("td");
    actionsCell.className = "row-actions";

    const describeBtn = document.createElement("button");
    describeBtn.type = "button";
    describeBtn.textContent = "Describe";
    describeBtn.addEventListener("click", () => describeBudget(budget.BudgetName));
    actionsCell.appendChild(describeBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteBudget(budget.BudgetName));
    actionsCell.appendChild(deleteBtn);

    row.appendChild(actionsCell);
    budgetsBody.appendChild(row);
  }
}

async function describeBudget(budgetName) {
  try {
    const { Budget } = await client.send(
      new DescribeBudgetCommand({ AccountId: ACCOUNT_ID, BudgetName: budgetName }),
    );
    document.getElementById("describe-title").textContent = `Budget details — ${budgetName}`;
    document.getElementById("describe-value").textContent = JSON.stringify(Budget, null, 2);
    describeDialog.showModal();
  } catch (error) {
    showStatus(`Failed to describe "${budgetName}": ${error.message}`, true);
  }
}

async function deleteBudget(budgetName) {
  if (!window.confirm(`Delete budget "${budgetName}"?`)) return;
  try {
    await client.send(new DeleteBudgetCommand({ AccountId: ACCOUNT_ID, BudgetName: budgetName }));
    showStatus(`Deleted budget "${budgetName}".`, false);
    await refreshBudgets();
  } catch (error) {
    showStatus(`Failed to delete "${budgetName}": ${error.message}`, true);
  }
}

document.getElementById("refresh-btn").addEventListener("click", () => {
  clearStatus();
  refreshBudgets();
});

document.getElementById("new-budget-btn").addEventListener("click", () => {
  document.getElementById("create-name").value = "";
  document.getElementById("create-amount").value = "100";
  createDialog.showModal();
});

document.getElementById("create-cancel").addEventListener("click", () => {
  createDialog.close();
});

document.getElementById("create-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const budgetName = document.getElementById("create-name").value.trim();
  const amount = document.getElementById("create-amount").value;
  if (!budgetName || !amount) return;

  try {
    await client.send(
      new CreateBudgetCommand({
        AccountId: ACCOUNT_ID,
        Budget: {
          BudgetName: budgetName,
          BudgetType: "COST",
          TimeUnit: "MONTHLY",
          BudgetLimit: { Amount: amount, Unit: "USD" },
        },
      }),
    );
    createDialog.close();
    showStatus(`Created budget "${budgetName}".`, false);
    await refreshBudgets();
  } catch (error) {
    showStatus(`Failed to create budget: ${error.message}`, true);
  }
});

refreshBudgets();
