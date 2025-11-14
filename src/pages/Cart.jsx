// src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import supabase from '../supabaseClient';

const Cart = () => {
  const { cart, addToCart, removeFromCart, decreaseQuantity, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  const [userProfile, setUserProfile] = useState(null);
  const [useProfile, setUseProfile] = useState(false); // toggle between profile and new input
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        try {
          const docRef = doc(db, 'users', u.uid); // assuming you have a 'users' collection
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('User not logged in.');
    if (cart.length === 0) return alert('Cart is empty.');

    setLoading(true);

    // Decide which info to use
    const checkoutData = useProfile && userProfile ? {
      name: userProfile.name,
      address: userProfile.address,
      phone: userProfile.phone,
      email: userProfile.email
    } : formData;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      // 1️⃣ Add order to Firebase
      await addDoc(collection(db, 'orders'), {
        uid: user.uid,
        email: user.email,
        ...checkoutData,
        items: cart,
        total,
        created_at: serverTimestamp(),
      });

      // 2️⃣ Add order to Supabase
      const { error: supabaseError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.uid,           // important for your tracker
            email: checkoutData.email,
            name: checkoutData.name,
            address: checkoutData.address,
            phone: checkoutData.phone,
            items: cart,
            total,
            status: 'pending'            // default status
          }
        ]);

      if (supabaseError) {
        console.error('Supabase Error:', supabaseError);
      }

      clearCart();
      setFormData({ name: '', address: '', phone: '', email: '' });
      setShowPayment(true);
    } catch (err) {
      console.error('Firebase Error:', err);
      alert('Failed to place order.');
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
                  <p>
                    ₦{Number(item.price).toLocaleString()} × {item.quantity} = <strong>₦{(item.price * item.quantity).toLocaleString()}</strong>
                  </p>
                  <div className="qty-controls">
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '10px' }}>Remove</button>
              </li>
            ))}
          </ul>

          <h3>Total: ₦{total.toLocaleString()}</h3>

          <button onClick={clearCart} style={{ marginBottom: '20px' }}>Clear Cart</button>

          {/* Toggle between profile info or new input */}
          {userProfile && (
            <div style={{ marginBottom: '15px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={useProfile}
                  onChange={() => setUseProfile(!useProfile)}
                /> Use my saved profile info
              </label>
            </div>
          )}

          <form onSubmit={handleSubmit} className="checkout-form">
            <h3>Checkout Details</h3>
            {/* Email input */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={useProfile && userProfile ? userProfile.email : formData.email}
              onChange={handleInput}
            />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={useProfile && userProfile ? userProfile.name : formData.name}
              onChange={handleInput}
              required={!useProfile}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={useProfile && userProfile ? userProfile.address : formData.address}
              onChange={handleInput}
              required={!useProfile}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={useProfile && userProfile ? userProfile.phone : formData.phone}
              onChange={handleInput}
              required={!useProfile}
            />
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
          <p className="thank-you">
            After payment, kindly send proof to our support WhatsApp 08180552305 📱
          </p>
        </div>
      )}
    </div>
  );
};

export default Cart;
