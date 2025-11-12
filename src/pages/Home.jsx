// src/pages/Home.jsx
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import supabase from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import { SearchContext } from "../context/SearchContext";
import Footer from "../components/Footer";

// ✅ Import hero images
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import newsletterHero from "../assets/newsletter-hero.jpg";

// ✅ Import category images
import shirtsImg from "../assets/shirt.jpg";
import trousersImg from "../assets/trouser.jpg";
import capsImg from "../assets/cap.jpg";
import jewelryImg from "../assets/jewelry.jpg";
import shoesImg from "../assets/shoe.jpg";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { searchTerm } = useContext(SearchContext);

  const tables = ["shirts_and_polos", "trousers", "caps", "jewelries", "shoes"];

  // ✅ Fetch from Supabase
  const fetchFromTable = async (table) => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })
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

  // 🎞️ Hero background rotation
  const backgroundImages = [hero1, hero2, hero3];
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 📰 Newsletter
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return setMessage("Please enter your email");

    const { error } = await supabase.from("newsletter").insert([{ email }]);
    if (error) setMessage("Error subscribing: " + error.message);
    else {
      setMessage("Subscribed successfully! 🎉");
      setEmail("");
    }
  };

  // ✅ Categories
  const categories = [
    { name: "Shirts & Polos", image: shirtsImg },
    { name: "Trousers", image: trousersImg },
    { name: "Caps", image: capsImg },
    { name: "Jewelries", image: jewelryImg },
    { name: "Shoes", image: shoesImg },
  ];

  // Helper function to generate proper slugs
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")       // replace & with 'and'
      .replace(/\s+/g, "-")       // replace spaces with hyphen
      .replace(/[^\w-]/g, "");    // remove other special chars
  };

  return (
    <div className="home-container">
      {/* 🌀 Scrolling Banner */}
      <div className="scroll-banner">
        <p>
          <strong>V6ix Collection</strong> — Trendy. Classy. Affordable! 💎🚚💨
          Delivery takes 24 to 48 hours
        </p>
      </div>

      {/* 🖼️ Hero Section */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${backgroundImages[currentBg]})`,
        }}
      >
        <div className="overlay">
          <div className="welcome-message">
            <h2>Welcome to V6ix Collection</h2>
            <p>
              Step into a world where fashion meets confidence and comfort. At{" "}
              <strong>V6ix Collection</strong>, we believe style should speak
              effortlessly — from timeless essentials to standout pieces that
              define elegance and class.
            </p>
          </div>
        </div>
      </div>

      {/* 🧭 Shop by Category Section */}
      <div style={{ marginTop: "30px", padding: "10px 15px" }}>
        <h2
          style={{
            color: "#946868ff",
            marginBottom: "10px",
            fontWeight: "bold",
            fontSize: "1.4rem",
          }}
        >
          Shop by Category
        </h2>

        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "15px",
            paddingBottom: "10px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((cat, index) => {
            const categoryLink = `/category/${generateSlug(cat.name)}`;
            return (
              <Link to={categoryLink} key={index} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    minWidth: "140px",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#333",
                      fontSize: "0.9rem",
                      marginRight: "10px",
                    }}
                  >
                    {cat.name}
                  </span>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 🛍️ Featured Section */}
      <div className="featured-section">
        <h2 className="featured-title">Featured</h2>
        <div className="grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard
                product={product}
                key={`${product.id}-${product._category}-${index}`}
                className="home-card"
              />
            ))
          ) : (
            <p>No matching products found.</p>
          )}
        </div>
      </div>

      {/* ✨ Why Choose Us Section */}
      <section
        style={{
          backgroundColor: "#faf9f6",
          textAlign: "center",
          padding: "80px 20px",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "40px",
            color: "#2e2e2e",
          }}
        >
          Why Choose <span style={{ color: "#b8914d" }}>V6ix Collection</span>?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {[
            {
              title: "Unmatched Quality",
              text: "Every item in our collection is carefully handpicked for premium quality and comfort. We don’t just sell fashion — we deliver excellence that lasts.",
            },
            {
              title: "Exclusive Designs",
              text: "Stand out in style! Our pieces are tailored to give you that bold, confident look that turns heads wherever you go.",
            },
            {
              title: "Trusted by Many",
              text: "From casual wear to luxury outfits, thousands trust V6ix Collection for authenticity, reliability, and an unbeatable shopping experience.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "30px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "15px",
                  color: "#b8914d",
                }}
              >
                {item.title}
              </h3>
              <p style={{ color: "#555", lineHeight: "1.7" }}>{item.text}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "60px", maxWidth: "800px", marginInline: "auto" }}>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#333",
              lineHeight: "1.8",
            }}
          >
            At{" "}
            <span style={{ color: "#b8914d", fontWeight: "600" }}>
              V6ix Collection
            </span>
            , fashion is more than clothing — it’s confidence, identity, and
            attitude. We’re here to make sure every outfit tells your story in
            style.
          </p>
        </div>
      </section>

      {/* 📰 Newsletter Section */}
      <div
        className="newsletter-hero"
        style={{
          backgroundImage: `url(${newsletterHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 20px",
          textAlign: "center",
          color: "#fff",
          margin: "40px 0",
          borderRadius: "10px",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "40px",
            borderRadius: "10px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Join the V6ix Collection Newsletter
          </h2>
          <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
            Stay updated on our latest arrivals, exclusive offers, and fashion
            tips! Be the first to know and elevate your style with us.
          </p>

          <form
            onSubmit={handleSubscribe}
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: "0.8rem",
                borderRadius: "6px",
                border: "none",
                flex: "1 0 250px",
                maxWidth: "300px",
              }}
              required
            />
            <button
              type="submit"
              style={{
                padding: "0.8rem 1.5rem",
                borderRadius: "6px",
                backgroundColor: "#ff416c",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                flex: "0 0 auto",
              }}
            >
              Subscribe
            </button>
          </form>
          {message && <p style={{ marginTop: "1rem", color: "#ffd700" }}>{message}</p>}
        </div>
      </div>

      {/* 🎨 Inline Styles */}
      <style jsx="true">{`
        .scroll-banner {
          background: linear-gradient(90deg, rgb(15, 14, 14), #ff416c);
          color: white;
          padding: 5px 0;
          font-weight: bold;
          overflow: hidden;
          white-space: nowrap;
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

        .featured-section {
          padding: 40px 20px;
          background: #f9f9f9;
        }

        .featured-title {
          text-align: left;
          margin-bottom: 20px;
          color: #946868ff;
          font-weight: bold;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
