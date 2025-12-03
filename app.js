// app.js
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all items
app.get('/items', (req, res) => {
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create item
app.post('/items', (req, res) => {
  const { name, price } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: 'name and price are required' });
  }

  db.run(
    'INSERT INTO items (name, price) VALUES (?, ?)',
    [name, price],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        id: this.lastID,
        name,
        price
      });
    }
  );
});

// Get one item
app.get('/items/:id', (req, res) => {
  db.get('SELECT * FROM items WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

// Delete item
app.delete('/items/:id', (req, res) => {
  db.run('DELETE FROM items WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
