import React, { useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  "Shirts & Polos",
  "Trousers",
  "Caps",
  "Jewelries",
  "Shoes",
];

const CategoryDropdown = ({ icon }) => {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen((prev) => !prev);
  const handleLinkClick = () => setOpen(false); // close after clicking a category

  return (
    <div className="dropdown">
      <span className="dropbtn" onClick={toggleDropdown}>
        {icon ? icon : "Category"}
      </span>

      {open && (
        <div className="dropdown-content show">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={`/category/${encodeURIComponent(cat)}`}
              onClick={handleLinkClick} // close dropdown when link clicked
            >
              {cat}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
