const express = require("express");
const router = express.Router();

router.post("/parse", async (req, res) => {
  const { input } = req.body;

  // MOCK (replace with OpenAI)
  const parsed = {
    intent: "create_order",
    items: [{ name: "shirt", quantity: 5 }],
    pickup_time: "2026-05-03T18:00:00",
    delivery_type: "standard",
  };

  res.json(parsed);
});

module.exports = router;
