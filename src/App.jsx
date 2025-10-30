import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import Cart from './pages/Cart';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ✅ Import Footer

const App = () => {
  return (
    <>
      <Navbar /> {/* ✅ Navbar with cart count and dropdown */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer /> {/* ✅ Footer always visible */}
    </>
  );
};

export default App;
