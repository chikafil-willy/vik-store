import { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { SearchContext } from '../context/SearchContext';
import { usePagination } from '../context/PaginationContext';

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

  const {
    products,
    totalPages,
    currentPage,
    fetchProducts,
    nextPage,
    prevPage,
    resetPage,
  } = usePagination();

  const decodedName = decodeURIComponent(name).toLowerCase().trim();
  const tableName = tableMap[decodedName];
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    resetPage();
    if (tableName) {
      fetchProducts(tableName, 1);
    }
  }, [tableName]);

  // ✅ Filter products by searchTerm and size text in name
  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const sizeMatch = selectedSize
      ? product.name?.toLowerCase().includes(selectedSize.toLowerCase())
      : true;
    return nameMatch && sizeMatch;
  });

  const sizes = ['L', 'XL', 'XXL', '38', '41', '42', '44', '45'];

  return (
    <div className="page-container">
      <h2
  className="category-title"
  style={{
    textAlign: 'flex-start',      // centers the text
    fontSize: '1.3rem',          // adjust size
    textTransform: 'capitalize', // ensure first letter capitalized
    margin: '20px 0',          // spacing above and below
    color: '#9e7a7aff',             // text color
  }}
>
  {decodedName}
</h2>


      {/* ✅ Filter Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size === selectedSize ? '' : size)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #333',
              backgroundColor: selectedSize === size ? '#333' : '#fff',
              color: selectedSize === size ? '#fff' : '#333',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {size}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products found for this category.</p>
      ) : (
        <>
          <div className="grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => prevPage(tableName)}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => nextPage(tableName)}
              disabled={currentPage === totalPages}
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
