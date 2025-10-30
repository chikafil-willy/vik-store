// src/pages/Category.jsx
import { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { SearchContext } from '../context/SearchContext';
import { usePagination } from '../context/PaginationContext'; // ✅ Import pagination context

// ✅ Map readable names to Supabase table names
const tableMap = {
  'shirts & polos': 'shirts_and_polos',
  'shirts-and-polos': 'shirts_and_polos',
  trousers: 'trousers',
  caps: 'caps',
  jewelries: 'jewelries',
  shoes: 'shoes',
};

const Category = () => {
  const { name } = useParams();
  const { searchTerm } = useContext(SearchContext);

  // ✅ Pull state and actions from pagination context
  const {
    products,
    totalPages,
    currentPage,
    fetchProducts,
    nextPage,
    prevPage,
    resetPage,
  } = usePagination();

  // ✅ Convert category from URL into Supabase table name
  const decodedName = decodeURIComponent(name).toLowerCase().trim();
  const tableName = tableMap[decodedName];

  // ✅ Reset and fetch whenever category changes
  useEffect(() => {
    resetPage();
    if (tableName) {
      fetchProducts(tableName, 1);
    }
  }, [tableName]);

  // ✅ Filter products by search
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2 className="category-title capitalize">{decodedName}</h2>

      {filteredProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <>
          {/* ✅ Product grid */}
          <div className="grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* ✅ Pagination controls */}
          <div className="pagination">
            <button
              onClick={() => prevPage(tableName)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ⬅ Prev
            </button>

            <span className="px-3 text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => nextPage(tableName)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Category;
