import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import Loader from "../components/Loader";
import { mockProducts, mockCategories } from "../Utils/mockData";
import { formatPrice } from "../Utils/currency";
import { FiStar, FiFilter, FiX, FiChevronDown } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import HeartIcon from "./Products/HeartIcon";
import { addToCart } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";

const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    price: true,
    brands: true,
    ratings: true,
  });

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");

  const { categories, products, checked, radio } = useSelector((state) => state.shop);

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  // Use API data if available, otherwise use mock data
  const allCategories = categoriesQuery.data?.length > 0 ? categoriesQuery.data : mockCategories;
  const allProducts = filteredProductsQuery.data?.length > 0 ? filteredProductsQuery.data : mockProducts;

  // Initialize from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && !selectedCategories.includes(categoryParam)) {
      setSelectedCategories([categoryParam]);
    }
  }, [searchParams]);

  // Get unique brands from products
  const brands = [...new Set(allProducts.map(p => p.brand))];

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    if (product.rating < minRating) {
      return false;
    }
    const searchQuery = searchParams.get('search')?.toLowerCase();
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery)) {
      return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
      case "discount": return b.discount - a.discount;
      default: return 0;
    }
  });

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 3000]);
    setSelectedBrands([]);
    setMinRating(0);
    setSortBy("relevance");
  };

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success("Added to cart!");
  };

  const toggleFilterSection = (section) => {
    setExpandedFilters(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFiltersCount = selectedCategories.length + selectedBrands.length + (minRating > 0 ? 1 : 0);

  return (
    <div className="bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-4">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="card-elevated sticky top-24">
              <div className="p-4 border-b border-default flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-brand text-sm font-medium hover:underline transition-all"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <FilterSection
                title="CATEGORIES"
                expanded={expandedFilters.categories}
                onToggle={() => toggleFilterSection('categories')}
              >
                {allCategories.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-3 py-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={() => toggleCategory(cat._id)}
                      className="w-4 h-4 rounded border-2 border-default accent-blue-600 transition-all"
                    />
                    <span className="text-sm group-hover:text-brand transition-colors">{cat.name}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection
                title="PRICE"
                expanded={expandedFilters.price}
                onToggle={() => toggleFilterSection('price')}
              >
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="form-input py-2 px-3 text-sm w-24"
                      placeholder="Min"
                    />
                    <span className="text-secondary">to</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="form-input py-2 px-3 text-sm w-24"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </FilterSection>

              <FilterSection
                title="BRAND"
                expanded={expandedFilters.brands}
                onToggle={() => toggleFilterSection('brands')}
              >
                <div className="max-h-48 overflow-y-auto">
                  {brands.slice(0, 10).map((brand) => (
                    <label key={brand} className="flex items-center gap-3 py-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 rounded border-2 border-default accent-blue-600"
                      />
                      <span className="text-sm group-hover:text-brand transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection
                title="CUSTOMER RATINGS"
                expanded={expandedFilters.ratings}
                onToggle={() => toggleFilterSection('ratings')}
              >
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-3 py-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="flex items-center gap-1">
                      <span className="rating text-xs">{rating}+ <FiStar size={8} /></span>
                      <span className="text-sm group-hover:text-brand transition-colors">& above</span>
                    </span>
                  </label>
                ))}
              </FilterSection>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header Bar */}
            <div className="card-elevated p-4 mb-4 flex items-center justify-between gap-4 flex-wrap animate-fade-in">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden btn btn-secondary btn-sm"
                >
                  <FiFilter size={16} />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-1 w-5 h-5 bg-brand text-white rounded-full text-xs flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                <span className="text-sm text-secondary">
                  Showing <strong className="text-primary">{sortedProducts.length}</strong> products
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-secondary hidden sm:block">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-input py-2 px-4 text-sm w-auto pr-10 cursor-pointer"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="discount">Discount</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProductsQuery.isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card p-4 animate-pulse">
                    <div className="skeleton h-40 mb-4"></div>
                    <div className="skeleton h-4 mb-2"></div>
                    <div className="skeleton h-4 w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="card-elevated p-12 text-center animate-fade-in">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-secondary mb-6">Try adjusting your filters or search</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedProducts.map((product, index) => (
                  <ShopProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={() => addToCartHandler(product)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-card shadow-xl overflow-y-auto animate-slide-in-left">
            <div className="sticky top-0 bg-card p-4 border-b border-default flex items-center justify-between z-10">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="btn-icon"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-4">
              {/* Same filter content as desktop */}
              <FilterSection
                title="CATEGORIES"
                expanded={true}
              >
                {allCategories.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-3 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={() => toggleCategory(cat._id)}
                      className="w-4 h-4 rounded accent-blue-600"
                    />
                    <span className="text-sm">{cat.name}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="BRAND" expanded={true}>
                {brands.slice(0, 10).map((brand) => (
                  <label key={brand} className="flex items-center gap-3 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 rounded accent-blue-600"
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="CUSTOMER RATINGS" expanded={true}>
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-3 py-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mobile-rating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="rating text-xs">{rating}+ <FiStar size={8} /></span>
                    <span className="text-sm">& above</span>
                  </label>
                ))}
              </FilterSection>
            </div>

            <div className="sticky bottom-0 p-4 bg-card border-t border-default flex gap-3">
              <button onClick={clearFilters} className="btn btn-secondary flex-1">
                Clear
              </button>
              <button onClick={() => setShowFilters(false)} className="btn btn-primary flex-1">
                Apply ({sortedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Filter Section Component
const FilterSection = ({ title, expanded = true, onToggle, children }) => {
  return (
    <div className="border-b border-default">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <span className="text-xs font-semibold text-secondary tracking-wide">{title}</span>
        {onToggle && (
          <FiChevronDown
            size={16}
            className={`text-secondary transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96 opacity-100 pb-4 px-4' : 'max-h-0 opacity-0'
          }`}
      >
        {children}
      </div>
    </div>
  );
};

// Shop Product Card
const ShopProductCard = ({ product, onAddToCart, index }) => {
  return (
    <div
      className="card product-card group animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="product-image group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        <HeartIcon product={product} />
        {product.isAssured && (
          <span className="absolute bottom-2 left-2 badge-assured">
            ✓ Assured
          </span>
        )}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 badge-discount">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title group-hover:text-brand transition-colors duration-300">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <span className="rating text-xs">
            {product.rating?.toFixed(1)} <FiStar size={8} />
          </span>
          <span className="rating-count text-xs">({product.numReviews?.toLocaleString()})</span>
        </div>

        <div className="flex items-center flex-wrap gap-1 mb-3">
          <span className="price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <>
              <span className="price-original text-xs">{formatPrice(product.originalPrice)}</span>
              <span className="price-discount text-xs">{product.discount}% off</span>
            </>
          )}
        </div>

        {product.freeDelivery && (
          <p className="badge-freedelivery text-xs mb-3">Free Delivery</p>
        )}

        <button
          onClick={onAddToCart}
          className="w-full btn btn-cart py-2.5 text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Shop;
