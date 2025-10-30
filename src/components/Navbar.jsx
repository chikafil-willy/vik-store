import React from "react";
import { Link } from "react-router-dom";
import { MdSearch, MdShoppingCart, MdHome, MdCategory, MdClear } from "react-icons/md";
import logo from "../assets/logo.png";
import CategoryDropdown from "./CategoryDropdown";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";

const Navbar = () => {
  const { cart } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>

      <div className="navbar-right">
        {/* DESKTOP LINKS */}
        <div className="desktop-only">
          <Link to="/" className="nav-link">Home</Link>
          <CategoryDropdown />
        </div>

        {/* MOBILE ICON LINKS */}
        <div className="mobile-only">
          <Link to="/" className="nav-link" title="Home">
            <MdHome size={22} />
          </Link>
          <div title="Category">
            <CategoryDropdown icon={<MdCategory size={22} />} />
          </div>
        </div>

        {/* SEARCH BAR WITH CLEAR BUTTON */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Search button */}
          <button className="search-btn" type="button">
            <MdSearch size={20} />
          </button>

          {/* Clear button (only shows if input has value) */}
          {searchTerm && (
            <button
              className="clear-btn"
              type="button"
              onClick={() => setSearchTerm("")}
            >
              <MdClear size={20} />
            </button>
          )}
        </div>

        {/* CART */}
        <Link to="/cart" className="cart-link" title="Cart">
          <MdShoppingCart size={22} />
          <span className="cart-count">{cartItemCount}</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
