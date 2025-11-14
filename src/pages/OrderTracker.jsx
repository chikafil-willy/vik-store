import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColors = {
  All: "#ccc",
  Pending: "#f0ad4e",
  Processing: "#5bc0de",
  Shipped: "#0275d8",
  Delivered: "#5cb85c",
  Cancelled: "#d9534f",
};

const OrderTracker = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true); // NEW
  const [filterStatus, setFilterStatus] = useState("All");

  // 🔹 Listen for auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthChecking(false); // auth finished checking
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Fetch orders after user is ready
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const q = query(
      collection(db, "orders"),
      where("uid", "==", user.uid),
      orderBy("created_at", "desc") // requires composite index
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filtered = filterStatus === "All" ? data : data.filter((o) => o.status === filterStatus);
      setOrders(filtered);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, filterStatus]);

  if (authChecking) return <p>Checking login...</p>;
  if (!user) return <p>Please log in to view your orders.</p>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h2>Order Tracker</h2>

      <div style={{ marginBottom: 20 }}>
        {statuses.map((status) => (
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
          {orders.map((order) => (
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
              <p>
                <strong>Placed:</strong>{" "}
                {order.created_at?.seconds
                  ? new Date(order.created_at.seconds * 1000).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: statusColors[order.status] || "#f0ad4e",
                    fontWeight: "bold",
                  }}
                >
                  {order.status || "Pending"}
                </span>
              </p>
              <p><strong>Total:</strong> ₦{Number(order.total).toLocaleString()}</p>
              <p>
                <strong>Items:</strong>{" "}
                {order.items
                  ?.map(
                    (item, i) =>
                      `${item.name} x ${item.quantity}${i < order.items.length - 1 ? ", " : ""}`
                  )
                  .join("")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderTracker;
