const express = require("express");
const cors = require("cors");
const db = require("./db"); // ✅ FIX

const app = express();

app.use(cors());
app.use(express.json());

// AUTH ROUTES
app.use("/api/auth", require("./routes/auth"));

// PRODUCTS
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// ORDERS ROUTES
app.use("/api/orders", require("./routes/orders"));

// USER ORDER HISTORY
app.get("/api/orders/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT 
      o.id AS order_id,
      o.total,
      o.created_at,
      p.name AS product_name,
      oi.quantity
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// ADMIN PANEL
app.get("/api/admin/orders", (req, res) => {
  const sql = `
    SELECT 
      o.id AS order_id,
      u.name AS user_name,
      p.name AS product_name,
      oi.quantity,
      o.total,
      o.created_at
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    ORDER BY o.id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// START SERVER (LAST)
app.listen(5000, () => {
  console.log("Server running on port 5000");
});