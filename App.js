import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // Fetch orders
  const fetchOrders = () => {
    fetch(`${API_URL}/orders`)
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  // Create new order
  const createOrder = async (product) => {
    setLoading(true);
    const newOrder = {
      productId: product.id,
      productName: product.name,
      status: "Pending"
    };

    await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder)
    });

    setLoading(false);
    fetchOrders();
  };

  // Update order status
  const updateStatus = async (id, status) => {
    await fetch(`${API_URL}/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🛍️ Simple E-Commerce Platform</h1>

      <h2>Available Products</h2>
      <div style={{ display: "flex", gap: "15px" }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <h3>{p.name}</h3>
            <p>Price: ₹{p.price}</p>
            <button onClick={() => createOrder(p)} disabled={loading}>
              {loading ? "Placing..." : "Order Now"}
            </button>
          </div>
        ))}
      </div>

      <hr />
      <h2>Customer Orders</h2>
      <button onClick={fetchOrders}>🔄 Refresh Orders</button>

      <table border="1" style={{ marginTop: "15px", width: "80%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.productName}</td>
              <td>{o.status}</td>
              <td>
                {o.status === "Pending" && (
                  <button onClick={() => updateStatus(o.id, "Shipped")}>Ship</button>
                )}
                {o.status === "Shipped" && (
                  <button onClick={() => updateStatus(o.id, "Delivered")}>Deliver</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
