// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory data
let products = [
  { id: 1, name: "Laptop", price: 70000 },
  { id: 2, name: "Headphones", price: 2500 },
  { id: 3, name: "Smartwatch", price: 5500 }
];

let orders = [];

// ---------- ROUTES ----------

// 1️⃣ View all products
app.get("/products", (req, res) => {
  res.json(products);
});

// 2️⃣ View all orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

// 3️⃣ Create a new order
app.post("/orders", (req, res) => {
  const { productId } = req.body;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const newOrder = {
    id: orders.length + 1,
    productId,
    productName: product.name,
    status: "Pending"
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// 4️⃣ Update (manage) order status
app.patch("/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find(o => o.id === parseInt(id));

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  res.json(order);
});

// 5️⃣ Delete an order (optional)
app.delete("/orders/:id", (req, res) => {
  const { id } = req.params;
  orders = orders.filter(o => o.id !== parseInt(id));
  res.json({ message: "Order deleted successfully" });
});

// Server start
app.listen(PORT, () => {
  console.log(`🚀 E-Commerce API running on http://localhost:${PORT}`);
});
