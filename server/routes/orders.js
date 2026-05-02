const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  const { user_id, items, pickup_time, delivery_time, total_price } = req.body;

  try {
    const orderResult = await db.query(
      `INSERT INTO orders (id, user_id, pickup_time, delivery_time, total_price, status)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, 'pending')
       RETURNING id`,
      [user_id, pickup_time, delivery_time, total_price]
    );

    const orderId = orderResult.rows[0].id;

    for (let item of items) {
      await db.query(
        `INSERT INTO order_items 
        (id, order_id, item_id, quantity, unit_price, total_price)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)`,
        [
          orderId,
          item.item_id,
          item.quantity,
          item.unit_price,
          item.total_price,
        ]
      );
    }

    res.json({ success: true, orderId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
