const budgetInput = document.getElementById("budgetInput");
const setBudgetButton = document.getElementById("setBudgetButton");
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const emptyMessage = document.getElementById("emptyMessage");

const budgetDisplay = document.getElementById("budgetDisplay");
const totalDisplay = document.getElementById("totalDisplay");
const remainingDisplay = document.getElementById("remainingDisplay");
const budgetStatus = document.getElementById("budgetStatus");

let budget = 100000;
let expenses = [];
let nextId = 1;

function rupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}

function updateSummary() {
    const total = expenses.reduce(function(sum, item) {
        return sum + item.amount;
    }, 0);

    const remaining = budget - total;

    budgetDisplay.textContent = rupiah(budget);
    totalDisplay.textContent = rupiah(total);
    remainingDisplay.textContent = rupiah(remaining);

    if (budget === 0) {
        budgetStatus.textContent = "Anggaran belum diatur.";
        budgetStatus.className = "status neutral";
    } else if (remaining < 0) {
        budgetStatus.textContent = "Pengeluaran melebihi anggaran!";
        budgetStatus.className = "status warning";
    } else if (remaining === 0) {
        budgetStatus.textContent = "Anggaran sudah habis.";
        budgetStatus.className = "status warning";
    } else {
        budgetStatus.textContent = "Pengeluaran masih terkendali.";
        budgetStatus.className = "status";
    }

    remainingDisplay.style.color =
        remaining < 0 ? "#c0392b" : "#202b3c";
}

function renderExpenses() {
    expenseList.replaceChildren();

    emptyMessage.style.display =
        expenses.length === 0 ? "block" : "none";

    expenses.forEach(function(item) {
        const row = document.createElement("div");
        row.className = "expense-item";

        const info = document.createElement("div");
        info.className = "expense-info";

        const note = document.createElement("strong");
        note.textContent = item.note;

        const category = document.createElement("span");
        category.textContent = item.category;

        info.append(note, category);

        const right = document.createElement("div");
        right.className = "expense-right";

        const amount = document.createElement("strong");
        amount.textContent = rupiah(item.amount);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Hapus";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function() {
            expenses = expenses.filter(function(expense) {
                return expense.id !== item.id;
            });

            renderExpenses();
        });

        right.append(amount, deleteButton);
        row.append(info, right);
        expenseList.appendChild(row);
    });

    updateSummary();
}

setBudgetButton.addEventListener("click", function() {
    const newBudget = Number(budgetInput.value);

    if (budgetInput.value.trim() === "" ||
        !Number.isFinite(newBudget) || newBudget < 0) {
        alert("Masukkan anggaran yang benar.");
        return;
    }

    budget = newBudget;
    updateSummary();
});

expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const note = document.getElementById("note").value.trim();

    if (!Number.isFinite(amount) || amount <= 0 || note === "") {
        alert("Masukkan jumlah dan keterangan dengan benar.");
        return;
    }

    expenses.push({
        id: nextId++,
        amount: amount,
        category: category,
        note: note
    });

    expenseForm.reset();
    renderExpenses();
});

document.getElementById("clearButton").addEventListener("click", function() {
    if (expenses.length === 0) {
        alert("Belum ada pengeluaran untuk dihapus.");
        return;
    }

    const yakin = confirm("Hapus semua catatan pengeluaran?");

    if (yakin) {
        expenses = [];
        renderExpenses();
    }
});

updateSummary();
renderExpenses();
