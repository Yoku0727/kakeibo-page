const storageKey = "kakeiboEntries";
const form = document.querySelector("form");
const dateInput = document.querySelector("#date");
const itemInput = document.querySelector("#item");
const typeInput = document.querySelector("#type");
const amountInput = document.querySelector("#amount");
const totalAmount = document.querySelector("#total-amount");
const tableBody = document.querySelector("table tbody");

let entries = loadEntries();

function loadEntries() {
  const savedEntries = localStorage.getItem(storageKey);

  if (!savedEntries) {
    return [];
  }

  try {
    const parsedEntries = JSON.parse(savedEntries);
    return Array.isArray(parsedEntries) ? parsedEntries : [];
  } catch {
    return [];
  }
}

function saveEntries() {
  localStorage.setItem(storageKey, JSON.stringify(entries));
}

function renderEntries() {
  tableBody.replaceChildren();

  if (entries.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 4;
    emptyCell.textContent = "登録データはありません。";
    emptyRow.append(emptyCell);
    tableBody.append(emptyRow);
    updateTotal();
    return;
  }

  entries.forEach((entry) => {
    const row = document.createElement("tr");
    const values = [
      entry.date,
      entry.item,
      entry.type === "income" ? "収入" : "支出",
      `${entry.amount.toLocaleString("ja-JP")} 円`,
    ];

    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    tableBody.append(row);
  });

  updateTotal();
}

function updateTotal() {
  const total = entries.reduce((sum, entry) => {
    const amount = Number(entry.amount);
    return sum + (entry.type === "income" ? amount : -amount);
  }, 0);

  totalAmount.textContent = total.toLocaleString("ja-JP");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const entry = {
    id: crypto.randomUUID(),
    date: dateInput.value,
    item: itemInput.value.trim(),
    type: typeInput.value,
    amount: Number(amountInput.value),
  };

  entries.push(entry);
  saveEntries();
  renderEntries();
  form.reset();
});

renderEntries();