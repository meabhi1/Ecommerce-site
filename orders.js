const express = require("express");
const router = express.Router();
const db = require("../db");

// Place Order
router.post("/", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  db.query(
    "INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [user_id, product_id, quantity],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Order Placed");
    }
  );
});

module.exports = router;