// src/context/SearchContext.jsx
import { createContext, useContext, useState } from 'react';

export const SearchContext = createContext(); // 👈 This is what was missing

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
