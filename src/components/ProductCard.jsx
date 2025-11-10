import { useCart } from '../context/CartContext';

const ProductCard = ({ product, className = "" }) => {
  const { addToCart, cart } = useCart();
  const inCart = cart.some(item => item.id === product.id);

  return (
    <div className={`card ${className}`}>
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p><strong>₦{Number(product.price).toLocaleString()}</strong></p>
      <button onClick={() => addToCart(product)} disabled={inCart}>
        {inCart ? "Added" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCard;