// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db'); // <-- THIS LINE WAS MISSING
const Transaction = require('./models/Transaction');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Add a transaction
app.post('/api/transaction', async (req, res) => {
  const { type, amount, category, description } = req.body;

  if (!type || !amount || !category) {
    return res.status(400).json({ error: 'type, amount, and category are required' });
  }

  try {
    const id = await Transaction.create({ type, amount, category, description });
    res.status(201).json({ id, type, amount, category, description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.getAll();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    res.status(201).json({ id: result.insertId, username, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length > 0) {
      res.status(200).json({ message: 'Login successful', user: rows[0] });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Query user by email
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    // NOTE: For now, password is stored plaintext (not recommended).
    // Compare password (you should use hashed passwords in production)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Login successful - you can send back user info or token here
    res.json({ message: 'Login successful', userId: user.id, username: user.username });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
