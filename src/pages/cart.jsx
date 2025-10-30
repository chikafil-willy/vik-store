// src/pages/Cart.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import supabase from '../supabaseClient';

const Cart = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Cart is empty.');

    setLoading(true);

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // ✅ 1️⃣ Save order in Supabase
    const { error } = await supabase.from('orders').insert([
      {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        items: cart,
        total: total,
      },
    ]);

    if (error) {
      console.error('Supabase Error:', error.message);
      alert('❌ Failed to place order. Please try again.');
      setLoading(false);
      return;
    }

    // ✅ 2️⃣ Send email notification via Formspree
    try {
      const formattedItems = cart
        .map(
          (item, i) =>
            `${i + 1}. ${item.name} — ₦${item.price.toLocaleString()} × ${
              item.quantity
            } = ₦${(item.price * item.quantity).toLocaleString()}`
        )
        .join('\n');

      const message = `
New Order Received 🛍️

Customer Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}

-----------------------------
Items Ordered:
${formattedItems}
-----------------------------
Total: ₦${total.toLocaleString()}
`;

      await fetch('https://formspree.io/f/xpwykyaw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: '🛍️ New Order from V6ix Collection',
          message: message,
        }),
      });
    } catch (err) {
      console.error('Formspree Error:', err);
    }

    // ✅ 3️⃣ Reset
    setLoading(false);
    clearCart();
    setFormData({ name: '', address: '', phone: '', email: '' });
    setShowPayment(true);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cart.length === 0 && !showPayment && <p>No products in cart.</p>}

      {/* CART DISPLAY */}
      {cart.length > 0 && (
        <div>
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong>
                  <p>
                    ₦{Number(item.price).toLocaleString()} × {item.quantity} ={' '}
                    <strong>
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </strong>
                  </p>

                  <div className="qty-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ marginLeft: '10px' }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <h3>Total: ₦{total.toLocaleString()}</h3>

          <button onClick={clearCart} style={{ marginBottom: '20px' }}>
            Clear Cart
          </button>

          <form onSubmit={handleSubmit} className="checkout-form">
            <h3>Checkout Details</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInput}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInput}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInput}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInput}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      )}

      {/* PAYMENT MESSAGE */}
      {showPayment && (
        <div className="payment-info">
          <h3>Order Placed Successfully ✅</h3>
          <p>Please make payment using the option below:</p>

          <div className="bank-details">
            <h4>Bank Transfer</h4>
            <p><strong>Account Name:</strong> Victor Ahalaekwue</p>
            <p><strong>Account Number:</strong> 9061121025</p>
            <p><strong>Bank:</strong> Fcmb</p>
          </div>

          <p className="thank-you">
            After payment, kindly send proof to our support WhatsApp 08180552305 📱
          </p>
        </div>
      )}
    </div>
  );
};

export default Cart;
