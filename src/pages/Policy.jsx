// src/pages/Policy.jsx
import React from "react";

const Policy = () => {
  const containerStyle = {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    lineHeight: "1.7",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  };

  const titleStyle = {
    textAlign: "center",
    color: "#624fcaff",
    marginBottom: "30px",
  };

  const sectionTitleStyle = {
    color: "#222",
    borderBottom: "2px solid #ff6600",
    paddingBottom: "5px",
    marginTop: "30px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Our Store Policies</h1>

      {/* PRIVACY POLICY */}
      <section>
        <h2 style={sectionTitleStyle}>Privacy Policy</h2>
        <p>
          At <strong>v6ixcollection</strong>, we respect your privacy. We only
          collect information necessary to process your orders and improve your
          shopping experience. Your personal details will never be shared or
          sold to third parties.
        </p>
        <p>
          Payment details are securely handled using trusted third-party payment
          providers, and we do not store sensitive financial data on our servers.
        </p>
      </section>

      {/* TERMS & CONDITIONS */}
      <section>
        <h2 style={sectionTitleStyle}>Terms & Conditions</h2>
        <p>
          By using our website, you agree to provide accurate information during
          checkout and to use our platform for lawful purposes only. We reserve
          the right to refuse or cancel any orders that appear suspicious or
          fraudulent.
        </p>
        <p>
          Prices, promotions, and product availability may change without prior
          notice. In case of errors, we will contact you to resolve the issue or
          offer a full refund.
        </p>
      </section>

      {/* REFUND POLICY */}
      <section>
        <h2 style={sectionTitleStyle}>Refund & Return Policy</h2>
        <p>
          We value customer satisfaction. If you receive a wrong or damaged
          product, please contact us within <strong>48 hours</strong> of
          delivery with proof of issue.
        </p>
        <p>
          Refunds or exchanges are only processed after the returned product is
          inspected and approved. Shipping costs for returns are the buyer’s
          responsibility unless the error was ours.
        </p>
        <p>
          Digital items or personalized orders are <strong>non-refundable</strong>.
        </p>
      </section>

      <p style={{ marginTop: "40px", textAlign: "center", fontSize: "14px" }}>
        Last updated: November 2025
      </p>
    </div>
  );
};

export default Policy;