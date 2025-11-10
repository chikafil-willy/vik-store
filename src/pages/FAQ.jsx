import React from "react";

const FAQ = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ marginBottom: "1rem", color: "#007bff" }}>Frequently Asked Questions</h1>
      <div style={{ textAlign: "left" }}>
        <h3>1. How can I place an order?</h3>
        <p>You can browse products, add them to your cart, and proceed to checkout.</p>

        <h3>2. What payment methods are available?</h3>
        <p>We accept multiple payment methods including card payments and mobile wallets.</p>

        <h3>3. How do I track my order?</h3>
        <p>Once your order is shipped, you will receive a tracking number via email or SMS.</p>

        <h3>4. Can I return a product?</h3>
        <p>Yes! Returns are accepted within 7 days of delivery. Terms apply.</p>

        <h3>5. How do I contact support?</h3>
        <p>You can contact us via our WhatsApp, email, or the contact form on the site.</p>
      </div>
    </div>
  );
};

export default FAQ;
