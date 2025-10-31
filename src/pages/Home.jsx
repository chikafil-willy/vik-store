// src/pages/Home.jsx
import { useEffect, useState, useContext } from 'react';
import supabase from '../supabaseClient';
import ProductCard from '../components/ProductCard';
import { SearchContext } from '../context/SearchContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const { searchTerm } = useContext(SearchContext);

  const tables = ['shirts_and_polos', 'trousers', 'caps', 'jewelries', 'shoes'];

  const fetchFromTable = async (table) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2);

    if (error) {
      console.error(`Error fetching from ${table}:`, error.message);
      return [];
    }

    return data.map((item) => ({ ...item, _category: table }));
  };

  useEffect(() => {
    const fetchAll = async () => {
      const allResults = await Promise.all(tables.map(fetchFromTable));
      const combined = allResults.flat();
      const shuffled = combined.sort(() => Math.random() - 0.5);
      setProducts(shuffled);
    };

    fetchAll();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🎞️ Replace with your actual background image URLs
  const backgroundImages = [
    'https://vnwhmwwknjuzosarlump.supabase.co/storage/v1/object/public/images/IMG-20251024-WA0000%20(1).jpg',
    'https://vnwhmwwknjuzosarlump.supabase.co/storage/v1/object/public/images/IMG-20251024-WA0004.jpg',
    'https://vnwhmwwknjuzosarlump.supabase.co/storage/v1/object/public/images/IMG-20251024-WA0005.jpg',
  ];

  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* 🌀 Scrolling message */}
      <div className="scroll-banner">
        <p>
          <strong>V6ix Collection</strong> — Trendy. Classy.
          Affordable! 💎🚚💨Delivery takes 24 to 48 hours
        </p>
      </div>

      {/* 🖼️ Top Hero Section */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${backgroundImages[currentBg]})`,
        }}
      >
        <div className="overlay">
          <div className="welcome-message">
            <h2>Welcome to V6ix Collection</h2>
            <p>Step into a world where fashion meets confidence and comfort.  
              At <strong>V6ix Collection</strong>, we believe style should speak effortlessly,
              from timeless essentials to standout pieces that define elegance and class.
            </p>
          </div>
        </div>
      </div>

      {/* 🛍️ Featured Products Section */}
      <div className="featured-section">
        <h2 className="featured-title">✨ Featured Products ✨</h2>

        <div className="grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard
                product={product}
                key={`${product.id}-${product._category}-${index}`}
              />
            ))
          ) : (
            <p>No matching products found.</p>
          )}
        </div>
      </div>

      {/* 🎨 Styles */}
      <style jsx="true">{`
        .scroll-banner {
          background: linear-gradient(90deg, rgb(15, 14, 14), #ff416c);
          color: white;
          padding: 10px 0;
          font-weight: bold;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        }

        .scroll-banner p {
          display: inline-block;
          padding-left: 100%;
          animation: scrollText 15s linear infinite;
        }

        @keyframes scrollText {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        /* 🖼️ Hero Section */
        .hero-section {
          height: 60vh;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
          transition: background-image 1s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .overlay {
          background: rgba(0, 0, 0, 0.5);
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: #fff;
          text-align: center;
          padding: 0 10px;
        }

        .welcome-message h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .welcome-message p {
          font-size: 1.1rem;
        }

        /* 🛍️ Featured Section */
        .featured-section {
          padding: 40px 20px;
          background: #f9f9f9;
        }

        .featured-title {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
          font-weight: bold;
        }

        .grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

/* 📱 Mobile view: 2 per row */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .hero-section {
    height: 50vh;
  }

  .welcome-message h2 {
    font-size: 1.6rem;
  }

  .welcome-message p {
    font-size: 1rem;
  }
}

      `}</style>
    </div>
  );
};

export default Home;
