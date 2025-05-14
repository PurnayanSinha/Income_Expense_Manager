const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Other Income'];
const expenseCategories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Shopping', 'Other Expenses'];

let transactions = [];

function updateCategoryOptions() {
  const type = document.getElementById('type').value;
  const categorySelect = document.getElementById('category');
  categorySelect.innerHTML = '';

  const categories = type === 'Income' ? incomeCategories : expenseCategories;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.text = cat;
    categorySelect.add(option);
  });
}

function addTransaction() {
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  if (!description || isNaN(amount) || !category || !date) {
    alert('Please fill all fields.');
    return;
  }

  transactions.push({ description, amount, type, category, date });
  renderTransactions();
  updateSummary();
  updateCharts();
  clearForm();
}

function clearForm() {
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('date').value = '';
}

function renderTransactions() {
  const tbody = document.getElementById('transactionBody');
  tbody.innerHTML = '';
  transactions.forEach((t, index) => {
    const row = `<tr>
      <td>${t.description}</td>
      <td>₹${t.amount}</td>
      <td>${t.type}</td>
      <td>${t.category}</td>
      <td>${t.date}</td>
      <td>
        <button onclick="editTransaction(${index})">Edit</button>
        <button onclick="deleteTransaction(${index})">Delete</button>
      </td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function editTransaction(index) {
  const t = transactions[index];
  document.getElementById('description').value = t.description;
  document.getElementById('amount').value = t.amount;
  document.getElementById('type').value = t.type;
  updateCategoryOptions();
  document.getElementById('category').value = t.category;
  document.getElementById('date').value = t.date;

  transactions.splice(index, 1); // Remove so user can resubmit
  renderTransactions();
  updateSummary();
  updateCharts();
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  renderTransactions();
  updateSummary();
  updateCharts();
}

function updateSummary() {
  let income = 0;
  let expenses = 0;

  transactions.forEach(t => {
    if (t.type === 'Income') income += t.amount;
    else expenses += t.amount;
  });

  document.getElementById('totalIncome').textContent = income;
  document.getElementById('totalExpenses').textContent = expenses;
  document.getElementById('balance').textContent = income - expenses;
}

// CHARTS
let incomeChart, expenseChart, comparisonChart;

function updateCharts() {
  const incomeData = {};
  const expenseData = {};
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(t => {
    if (t.type === 'Income') {
      incomeData[t.category] = (incomeData[t.category] || 0) + t.amount;
      totalIncome += t.amount;
    } else {
      expenseData[t.category] = (expenseData[t.category] || 0) + t.amount;
      totalExpense += t.amount;
    }
  });

  const incomeCtx = document.getElementById('incomeChart').getContext('2d');
  const expenseCtx = document.getElementById('expenseChart').getContext('2d');
  const compareCtx = document.getElementById('comparisonChart').getContext('2d');

  if (incomeChart) incomeChart.destroy();
  if (expenseChart) expenseChart.destroy();
  if (comparisonChart) comparisonChart.destroy();

  incomeChart = new Chart(incomeCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(incomeData),
      datasets: [{ data: Object.values(incomeData), backgroundColor: ['#4caf50', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9'] }]
    },
    options: { plugins: { title: { display: true, text: 'Income Breakdown' } } }
  });

  expenseChart = new Chart(expenseCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(expenseData),
      datasets: [{ data: Object.values(expenseData), backgroundColor: ['#f44336', '#e57373', '#ef9a9a', '#ffcdd2', '#ffebee'] }]
    },
    options: { plugins: { title: { display: true, text: 'Expense Breakdown' } } }
  });

  comparisonChart = new Chart(compareCtx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [{ data: [totalIncome, totalExpense], backgroundColor: ['#4caf50', '#f44336'] }]
    },
    options: { plugins: { title: { display: true, text: 'Income vs Expense' } } }
  });
}

// Initialize default category
updateCategoryOptions();