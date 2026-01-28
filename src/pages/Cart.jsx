import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

const Cart = () => {
  const { cart, addToCart, removeFromCart, decreaseQuantity, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', address: '', phone: '', email: '' });
  const [userProfile, setUserProfile] = useState(null);
  const [useProfile, setUseProfile] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [orderError, setOrderError] = useState('');
  const [stockInfo, setStockInfo] = useState({});

  // Fetch logged-in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        try {
          const docRef = doc(db, 'users', u.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) setUserProfile(docSnap.data());
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch stock info
  useEffect(() => {
    const fetchStock = async () => {
      const updatedStock = {};
      for (let item of cart) {
        try {
          const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
          const res = await fetch(`${backendURL}/api/product-stock?name=${encodeURIComponent(item.name)}`);

          if (!res.ok) {
            console.warn(`Failed to fetch stock for ${item.name}: ${res.status}`);
            updatedStock[item.id] = 0;
            continue;
          }

          const data = await res.json();
          updatedStock[item.id] = Number(data.quantity) || 0;

        } catch (err) {
          console.error('Error fetching stock:', err);
          updatedStock[item.id] = 0;
        }
      }

      setStockInfo(updatedStock);
    };

    if (cart.length > 0) fetchStock();
  }, [cart]);

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('User not logged in.');
    if (cart.length === 0) return alert('Cart is empty.');

    setLoading(true);
    setOrderError('');

    const checkoutData = useProfile && userProfile
      ? { name: userProfile.name, address: userProfile.address, phone: userProfile.phone, email: userProfile.email }
      : formData;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Check stock before order
    for (let item of cart) {
      if ((stockInfo[item.id] ?? 0) < item.quantity) {
        setOrderError(`Product "${item.name}" is out of stock or insufficient quantity`);
        setLoading(false);
        return;
      }
    }

    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL || "";
      const response = await fetch(`${backendURL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...checkoutData,
          products: cart.map(item => ({ name: item.name, qty: item.quantity })),
          total
        })
      });

      const data = await response.json();
      if (!data.success) {
        setOrderError(data.message || 'Failed to place order.');
        setLoading(false);
        return;
      }

      // Store in Firebase
      await addDoc(collection(db, 'orders'), {
        uid: user.uid,
        email: checkoutData.email,
        ...checkoutData,
        items: cart,
        total,
        created_at: serverTimestamp(),
      });

      clearCart();
      setFormData({ name: '', address: '', phone: '', email: '' });
      setShowPayment(true);

    } catch (err) {
      console.error('Error placing order:', err);
      setOrderError('Failed to place order. Please try again.');
    }

    setLoading(false);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cart.length === 0 && !showPayment && <p>No products in cart.</p>}

      {cart.length > 0 && (
        <div>
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />}
                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong>
                  <p>₦{Number(item.price).toLocaleString()} × {item.quantity} = <strong>₦{(item.price * item.quantity).toLocaleString()}</strong></p>
                  <div className="qty-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                  {(stockInfo[item.id] ?? 0) < item.quantity && (
                    <p style={{ color: 'red' }}>Only {stockInfo[item.id] ?? 0} left in stock!</p>
                  )}
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '10px' }}>Remove</button>
              </li>
            ))}
          </ul>

          <h3>Total: ₦{total.toLocaleString()}</h3>
          <button onClick={clearCart} style={{ marginBottom: '20px' }}>Clear Cart</button>

          {userProfile && (
            <div style={{ marginBottom: '15px' }}>
              <label>
                <input type="checkbox" checked={useProfile} onChange={() => setUseProfile(!useProfile)} /> Use my saved profile info
              </label>
            </div>
          )}

          {orderError && <p style={{ color: 'red', marginBottom: '10px' }}>{orderError}</p>}

          <form onSubmit={handleSubmit} className="checkout-form">
            <h3>Checkout Details</h3>
            <input type="email" name="email" placeholder="Email" value={useProfile && userProfile ? userProfile.email : formData.email} onChange={handleInput} />
            <input type="text" name="name" placeholder="Full Name" value={useProfile && userProfile ? userProfile.name : formData.name} onChange={handleInput} required={!useProfile} />
            <input type="text" name="address" placeholder="Address" value={useProfile && userProfile ? userProfile.address : formData.address} onChange={handleInput} required={!useProfile} />
            <input type="tel" name="phone" placeholder="Phone Number" value={useProfile && userProfile ? userProfile.phone : formData.phone} onChange={handleInput} required={!useProfile} />
            <button type="submit" disabled={loading}>{loading ? 'Placing Order...' : 'Place Order'}</button>
          </form>
        </div>
      )}

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
          <p className="thank-you">After payment, kindly send proof to our support WhatsApp 08180552305 📱</p>
        </div>
      )}
    </div>
  );
};

export default Cart;
