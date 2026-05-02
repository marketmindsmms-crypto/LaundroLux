// server/services/orderService.js

function calculatePrice(items) {
  return items.reduce((total, item) => {
    return total + item.unit_price * item.quantity;
  }, 0);
}

function normalizeItems(rawItems) {
  return rawItems.map((item) => ({
    item_id: "uuid-shirt", // map properly
    quantity: item.quantity,
    unit_price: 50,
    total_price: item.quantity * 50,
  }));
}

module.exports = { calculatePrice, normalizeItems };
