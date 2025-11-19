import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import { PaginationProvider } from './context/PaginationContext'; // ✅ Import it

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <SearchProvider>
          <PaginationProvider> {/* ✅ Added */}
            <App />
          </PaginationProvider>
        </SearchProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);



