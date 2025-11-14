import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColors = {
  Pending: "#f0ad4e",
  Processing: "#5bc0de",
  Shipped: "#0275d8",
  Delivered: "#5cb85c",
  Cancelled: "#d9534f",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔐 ADMIN EMAIL
  const ADMIN_EMAIL = "v6ix@gmail.com";

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login"); // redirect if not logged in
        return;
      }

      if (user.email !== ADMIN_EMAIL) {
        navigate("/"); // redirect to homepage if wrong email
        return;
      }

      fetchOrders(); // user is admin → fetch orders
    });
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h2>Admin Orders Panel</h2>
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
                {order.created_at?.toDate ? order.created_at.toDate().toLocaleDateString() : ""}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: order.status ? statusColors[order.status] : statusColors.Pending,
                    fontWeight: "bold",
                  }}
                >
                  {order.status || "Pending"}
                </span>
              </p>
              <p><strong>Total:</strong> ₦{Number(order.total).toLocaleString()}</p>
              <p><strong>Items:</strong> {order.items?.map((i) => i.name).join(", ")}</p>

              <div style={{ marginTop: 10 }}>
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order.id, s)}
                    style={{
                      marginRight: 5,
                      padding: "4px 8px",
                      borderRadius: 4,
                      border: order.status === s ? `2px solid ${statusColors[s]}` : `1px solid #ccc`,
                      background: order.status === s ? statusColors[s] : "#fff",
                      color: order.status === s ? "#fff" : statusColors[s],
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminOrders;
