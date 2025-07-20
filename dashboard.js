// When page loads, fetch transactions and update dashboard
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('http://localhost:5000/api/transactions');
    if (!res.ok) throw new Error('Failed to fetch transactions');
    const transactions = await res.json();

    let totalIncome = 0;
    let totalExpenses = 0;

    const transactionList = document.getElementById('transaction-list');
    if (transactionList) {
      transactionList.innerHTML = ''; // clear loading message

      transactions.forEach(t => {
        if (t.type === 'income') totalIncome += parseFloat(t.amount);
        else if (t.type === 'expense') totalExpenses += parseFloat(t.amount);

        const li = document.createElement('li');
        li.textContent = `${t.type.toUpperCase()} - $${t.amount} (${t.category}) - ${t.description || ''} [${new Date(t.date).toLocaleDateString()}]`;
        transactionList.appendChild(li);
      });

      // If no transactions, show message
      if (transactions.length === 0) {
        transactionList.innerHTML = '<li>No transactions yet.</li>';
      }
    }

    // Update dashboard amounts safely
    const incomeAmountEl = document.getElementById('income-amount');
    if (incomeAmountEl) {
      incomeAmountEl.textContent = `$${totalIncome.toFixed(2)}`;
    }

    const expenseAmountEl = document.getElementById('expense-amount');
    if (expenseAmountEl) {
      expenseAmountEl.textContent = `$${totalExpenses.toFixed(2)}`;
    }

    const balanceAmountEl = document.getElementById('balance-amount');
    if (balanceAmountEl) {
      const balance = totalIncome - totalExpenses;
      balanceAmountEl.textContent = `$${balance.toFixed(2)}`;
    }

  } catch (error) {
    alert('Error loading dashboard data: ' + error.message);
  }
});
