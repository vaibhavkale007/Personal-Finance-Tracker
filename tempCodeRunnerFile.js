document.addEventListener("DOMContentLoaded", () => {
  // Fetch and display transactions and update balances on page load
  fetchTransactions();

  // Handle income form submit
  const incomeForm = document.getElementById("income-form");
  if (incomeForm) {
    incomeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById("income-amount").value);
      const category = document.getElementById("income-category").value;
      const description = document.getElementById("income-description").value;

      const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'income',
          amount,
          category,
          description
        })
      });
      if (res.ok) {
        alert('Income added successfully!');
        incomeForm.reset();
        fetchTransactions();
      } else {
        alert('Error adding income');
      }
    });
  }

  // Handle expense form submit
  const expenseForm = document.getElementById("expense-form");
  if (expenseForm) {
    expenseForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById("expense-amount").value);
      const category = document.getElementById("expense-category").value;
      const description = document.getElementById("expense-description").value;

      const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'expense',
          amount,
          category,
          description
        })
      });
      if (res.ok) {
        alert('Expense added successfully!');
        expenseForm.reset();
        fetchTransactions();
      } else {
        alert('Error adding expense');
      }
    });
  }
});

// Function to fetch transactions and update dashboard
async function fetchTransactions() {
  const res = await fetch('/api/transactions');
  const transactions = await res.json();

  // Update total income, expenses, balance
  let totalIncome = 0;
  let totalExpenses = 0;
  const transactionList = document.getElementById("transaction-list");

  if (transactionList) {
    transactionList.innerHTML = '';
  }

  transactions.forEach(t => {
    if (t.type === 'income') totalIncome += parseFloat(t.amount);
    else if (t.type === 'expense') totalExpenses += parseFloat(t.amount);

    if (transactionList) {
      const li = document.createElement('li');
      li.textContent = `${t.type.toUpperCase()} - $${t.amount} (${t.category}) - ${t.description || ''} [${new Date(t.date).toLocaleDateString()}]`;
      transactionList.appendChild(li);
    }
  });

  // Update dashboard amounts if they exist on page
  const incomeAmount = document.getElementById("income-amount") || document.getElementById("income-amount-display");
  const expenseAmount = document.getElementById("expense-amount") || document.getElementById("expense-amount-display");
  const balanceAmount = document.getElementById("balance-amount") || document.getElementById("balance");

  if (document.getElementById("income-amount")) {
    document.getElementById("income-amount").textContent = `$${totalIncome.toFixed(2)}`;
  }
  if (document.getElementById("expense-amount")) {
    document.getElementById("expense-amount").textContent = `$${totalExpenses.toFixed(2)}`;
  }
  if (document.getElementById("balance-amount")) {
    document.getElementById("balance-amount").textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;
  }
  if (document.getElementById("total-income")) {
    document.getElementById("total-income").textContent = `$${totalIncome.toFixed(2)}`;
  }
  if (document.getElementById("total-expenses")) {
    document.getElementById("total-expenses").textContent = `$${totalExpenses.toFixed(2)}`;
  }
  if (document.getElementById("balance")) {
    document.getElementById("balance").textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;
  }
}
document.getElementById('income-form').addEventListener('submit', async function(e) {
  e.preventDefault(); // Stop form from refreshing the page

  const amount = document.getElementById('income-amount').value;
  const category = document.getElementById('income-category').value;
  const description = document.getElementById('income-description').value;

  const transaction = {
    type: 'income',
    amount: parseFloat(amount),
    category: category,
    description: description
  };

  try {
    const response = await fetch('http://localhost:5000/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });

    const data = await response.json();
    alert('Income added successfully!');
    // Clear form
    this.reset();
  } catch (error) {
    alert('Error adding income: ' + error.message);
  }
});
document.getElementById('expense-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const amount = document.getElementById('expense-amount').value;
  const category = document.getElementById('expense-category').value;
  const description = document.getElementById('expense-description').value;

  const transaction = {
    type: 'expense',
    amount: parseFloat(amount),
    category: category,
    description: description
  };

  try {
    const response = await fetch('http://localhost:5000/api/transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });

    const data = await response.json();
    alert('Expense added successfully!');
    this.reset();
  } catch (error) {
    alert('Error adding expense: ' + error.message);
  }
});
async function loadTransactions() {
  try {
    const response = await fetch('http://localhost:5000/api/transactions');
    const transactions = await response.json();

    const list = document.getElementById('transaction-list');
    list.innerHTML = ''; // Clear existing items

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
      const li = document.createElement('li');
      li.textContent = `${t.type.toUpperCase()} - $${t.amount} - ${t.category} - ${t.description || ''}`;
      list.appendChild(li);

      if (t.type === 'income') totalIncome += t.amount;
      else totalExpenses += t.amount;
    });

    document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('balance').textContent = `$${(totalIncome - totalExpenses).toFixed(2)}`;

  } catch (error) {
    alert('Error loading transactions: ' + error.message);
  }
}

// Call the function on page load
if (document.getElementById('transaction-list')) {
  loadTransactions();
}
async function register() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!username || !email || !password) {
        alert('Please fill all fields');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert('Registration successful!');
            // Optionally redirect to login page
            window.location.href = 'login.html';
        } else {
            const data = await response.json();
            alert('Error: ' + data.error);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}
