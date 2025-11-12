import { useCart } from '../context/CartContext';
import { auth } from '../firebase';

const ProductCard = ({ product, className = "" }) => {
  const { addToCart, cart } = useCart();
  const inCart = cart.some(item => item.id === product.id);

  const handleAddToCart = () => {
    if (!auth.currentUser) {
      alert("Please log in to add items to your cart!");
      return;
    }
    addToCart(product);
  };

  return (
    <div className={`card ${className}`} style={{ textAlign: "center", padding: "1rem", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <img src={product.image_url} alt={product.name} style={{ width: "100%", borderRadius: "10px", objectFit: "cover" }} />
      <h3 style={{ margin: "10px 0" }}>{product.name}</h3>
      <p><strong>₦{Number(product.price).toLocaleString()}</strong></p>
      <button
        onClick={handleAddToCart}
        disabled={inCart}
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "6px",
          backgroundColor: inCart ? "#aaa" : "#ff416c",
          color: "#fff",
          cursor: inCart ? "not-allowed" : "pointer",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => !inCart && (e.target.style.background = "#ff1e5b")}
        onMouseOut={(e) => !inCart && (e.target.style.background = "#ff416c")}
      >
        {inCart ? "Added" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCard;
