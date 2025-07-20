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

      const transaction = {
        type: 'income',
        amount,
        category,
        description
      };

      try {
        const res = await fetch('http://localhost:5000/api/transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction)
        });

        if (res.ok) {
          alert('Income added successfully!');
          incomeForm.reset();
          fetchTransactions();
        } else {
          const data = await res.json();
          alert('Error: ' + data.error);
        }
      } catch (error) {
        alert('Error adding income: ' + error.message);
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

      const transaction = {
        type: 'expense',
        amount,
        category,
        description
      };

      try {
        const res = await fetch('http://localhost:5000/api/transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction)
        });

        if (res.ok) {
          alert('Expense added successfully!');
          expenseForm.reset();
          fetchTransactions();
        } else {
          const data = await res.json();
          alert('Error: ' + data.error);
        }
      } catch (error) {
        alert('Error adding expense: ' + error.message);
      }
    });
  }
});

// Function to fetch transactions and update dashboard
async function fetchTransactions() {
  try {
    const res = await fetch('http://localhost:5000/api/transactions');
    if (!res.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const transactions = await res.json();

    let totalIncome = 0;
    let totalExpenses = 0;
    const transactionList = document.getElementById("transaction-list");

    if (transactionList) {
      transactionList.innerHTML = '';
    }

    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += parseFloat(t.amount);
      } else if (t.type === 'expense') {
        totalExpenses += parseFloat(t.amount);
      }

      if (transactionList) {
        const li = document.createElement('li');
        li.textContent = `${t.type.toUpperCase()} - ₹${parseFloat(t.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${t.category}) - ${t.description || ''} [${new Date(t.date).toLocaleDateString()}]`;
        transactionList.appendChild(li);
      }
    });

    updateDashboard(totalIncome, totalExpenses);
  } catch (error) {
    alert('Error loading transactions: ' + error.message);
  }
}

function updateDashboard(totalIncome, totalExpenses) {
  const balance = totalIncome - totalExpenses;

  const totalIncomeEl = document.getElementById("total-income");
  const totalExpensesEl = document.getElementById("total-expenses");
  const balanceEl = document.getElementById("balance");

  if (totalIncomeEl) totalIncomeEl.textContent = `₹${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  if (totalExpensesEl) totalExpensesEl.textContent = `₹${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  if (balanceEl) balanceEl.textContent = `₹${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}


// Registration function
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
      window.location.href = 'login.html';
    } else {
      const data = await response.json();
      alert('Error: ' + data.error);
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    alert('Please fill all fields');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Login successful!');
      window.location.href = 'dashboard.html'; // Redirect after login
    } else {
      alert('Error: ' + data.error);
    }
  } catch (err) {
    alert('Login failed: ' + err.message);
  }
}
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Login successful!');
      // Save login state here (e.g., in localStorage)
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
      // Redirect to dashboard
      window.location.href = 'index.html';
    } else {
      alert('Error: ' + data.error);
    }
  } catch (err) {
    alert('Network error: ' + err.message);
  }
}
