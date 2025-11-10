import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Category from './pages/Category';
import Cart from './pages/Cart';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // ✅ Import Footer
import { auth } from './firebase';
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import Policy from "./pages/Policy";

console.log("Firebase connected:", auth);


const App = () => {
  return (
    <>
      <Navbar /> {/* ✅ Navbar with cart count and dropdown */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/policy" element={<Policy />} />
      </Routes>
      <Footer /> {/* ✅ Footer always visible */}
    </>
  );
};

export default App;
