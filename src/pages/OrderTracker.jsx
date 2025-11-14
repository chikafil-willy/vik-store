// src/pages/OrderTracker.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

// Define colors for each status
const statusColors = {
  All: "#ccc",
  Pending: "#f0ad4e",      // orange
  Processing: "#5bc0de",   // blue
  Shipped: "#0275d8",      // dark blue
  Delivered: "#5cb85c",    // green
  Cancelled: "#d9534f",    // red
};

const OrderTracker = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  // Listen for user login
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // Fetch orders in real-time
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(
      collection(db, "orders"),
      where("uid", "==", user.uid),
      orderBy("created_at", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Apply status filter
      const filtered = filterStatus === "All" ? data : data.filter(order => order.status === filterStatus);
      setOrders(filtered);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, filterStatus]);

  if (!user) return <p>Please log in to view your orders.</p>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h2>Order Tracker</h2>

      {/* Status Filter */}
      <div style={{ marginBottom: 20 }}>
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              marginRight: 10,
              padding: "6px 12px",
              borderRadius: 5,
              border: `1px solid ${statusColors[status]}`,
              background: filterStatus === status ? statusColors[status] : "#fff",
              color: filterStatus === status ? "#fff" : statusColors[status],
              cursor: "pointer",
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {orders.map(order => (
            <li
              key={order.id}
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                marginBottom: "10px",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Placed:</strong> {new Date(order.created_at?.seconds * 1000).toLocaleDateString()}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      order.status === "Delivered" ? statusColors.Delivered :
                      order.status === "Cancelled" ? statusColors.Cancelled :
                      order.status === "Processing" ? statusColors.Processing :
                      order.status === "Shipped" ? statusColors.Shipped :
                      order.status === "Pending" ? statusColors.Pending :
                      "#4a90e2",
                    fontWeight: "bold",
                  }}
                >
                  {order.status || "Pending"}
                </span>
              </p>
              <p><strong>Total:</strong> ₦{Number(order.total).toLocaleString()}</p>
              <p>
                <strong>Items:</strong>{" "}
                {order.items.map((item, i) => `${item.name} x ${item.quantity}${i < order.items.length - 1 ? ", " : ""}`)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderTracker;
