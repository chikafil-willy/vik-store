// src/context/PaginationContext.jsx
import { createContext, useState, useContext } from "react";
import supabase from "../supabaseClient";

const PaginationContext = createContext();
export const usePagination = () => useContext(PaginationContext);

export const PaginationProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  // ✅ Main fetch function for any category table
  const fetchProducts = async (table, page = 1) => {
    if (!table) return;

    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, error, count } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
    } else {
      setProducts(data);
      setTotalPages(Math.ceil(count / itemsPerPage));
      setCurrentPage(page);
    }
  };

  const nextPage = (table) => {
    if (currentPage < totalPages) fetchProducts(table, currentPage + 1);
  };

  const prevPage = (table) => {
    if (currentPage > 1) fetchProducts(table, currentPage - 1);
  };

  const resetPage = () => setCurrentPage(1);

  return (
    <PaginationContext.Provider
      value={{
        products,
        totalPages,
        currentPage,
        fetchProducts,
        nextPage,
        prevPage,
        resetPage,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
};
