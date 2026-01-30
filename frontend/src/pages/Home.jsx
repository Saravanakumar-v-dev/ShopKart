import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import { mockProducts, mockBanners, mockCategories, getProductsByCategory } from "../Utils/mockData";
import { formatPrice } from "../Utils/currency";
import { FiChevronRight, FiChevronLeft, FiStar } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

const Home = () => {
  const { data, isLoading } = useGetProductsQuery({});
  const [currentBanner, setCurrentBanner] = useState(0);

  // Use API data if available, otherwise use mock data
  const products = data?.products?.length > 0 ? data.products : mockProducts;

  // Banner auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % mockBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="bg-primary min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        {mockBanners.map((banner, index) => (
          <Link
            key={banner.id}
            to={banner.link}
            className={`absolute inset-0 transition-all duration-700 ease-out ${index === currentBanner
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
              }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`}>
              <div className="absolute inset-0 bg-black/30" />
            </div>
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white animate-fade-in-up">
                <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                  {banner.title}
                </h1>
                <p className="text-lg md:text-xl opacity-90 drop-shadow">
                  {banner.subtitle}
                </p>
                <button className="btn btn-primary mt-6">
                  Shop Now
                </button>
              </div>
            </div>
          </Link>
        ))}

        {/* Banner Navigation Arrows */}
        <button
          onClick={() => setCurrentBanner((prev) => (prev - 1 + mockBanners.length) % mockBanners.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 btn-icon bg-white/20 backdrop-blur-sm border-0 hover:bg-white/40"
        >
          <FiChevronLeft size={24} className="text-white" />
        </button>
        <button
          onClick={() => setCurrentBanner((prev) => (prev + 1) % mockBanners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 btn-icon bg-white/20 backdrop-blur-sm border-0 hover:bg-white/40"
        >
          <FiChevronRight size={24} className="text-white" />
        </button>

        {/* Banner Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {mockBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentBanner ? 'bg-white w-8' : 'bg-white/50 w-2 hover:bg-white/80'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Category Cards */}
      <section className="max-w-7xl mx-auto px-4 py-6 animate-fade-in-up">
        <div className="card-elevated p-5">
          <h2 className="text-lg font-semibold mb-4">Shop by Category</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {mockCategories.map((category, index) => (
              <Link
                key={category._id}
                to={`/shop?category=${category._id}`}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-hover transition-all duration-300 hover:shadow-md group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-3xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
                  {category.icon}
                </span>
                <span className="text-xs text-center text-secondary font-medium group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deals of the Day */}
      <ProductSection
        title="Deals of the Day"
        products={products.filter(p => p.discount >= 15).slice(0, 8)}
        viewAllLink="/shop"
        bgColor="bg-gradient-to-r from-red-500/10 to-orange-500/10"
      />

      {/* Electronics Section */}
      <ProductSection
        title="Best of Electronics"
        subtitle="Top picks from leading brands"
        products={getProductsByCategory('cat1').slice(0, 8)}
        viewAllLink="/shop?category=cat1"
      />

      {/* Fashion Section */}
      <ProductSection
        title="Fashion & Lifestyle"
        subtitle="Trending styles for you"
        products={getProductsByCategory('cat2').slice(0, 8)}
        viewAllLink="/shop?category=cat2"
      />

      {/* Home & Furniture */}
      <ProductSection
        title="Home & Furniture"
        subtitle="Transform your living space"
        products={getProductsByCategory('cat3').slice(0, 6)}
        viewAllLink="/shop?category=cat3"
      />

      {/* Gaming Section */}
      <ProductSection
        title="Gaming Zone"
        subtitle="Level up your gaming"
        products={getProductsByCategory('cat8').slice(0, 6)}
        viewAllLink="/shop?category=cat8"
        bgColor="bg-gradient-to-r from-purple-500/10 to-blue-500/10"
      />

      {/* Books Section */}
      <ProductSection
        title="Top Reads"
        subtitle="Books that inspire"
        products={getProductsByCategory('cat7').slice(0, 4)}
        viewAllLink="/shop?category=cat7"
      />
    </div>
  );
};

// Product Section Component with Horizontal Scroll
const ProductSection = ({ title, subtitle, products, viewAllLink, bgColor = '' }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <section className={`max-w-7xl mx-auto px-4 py-4 animate-fade-in-up ${bgColor} rounded-lg my-2`}>
      <div className="card-elevated p-5 relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-secondary mt-1">{subtitle}</p>}
          </div>
          <Link
            to={viewAllLink}
            className="btn btn-primary btn-sm"
          >
            View All
          </Link>
        </div>

        {/* Scroll Arrows */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 btn-icon shadow-lg bg-card"
          >
            <FiChevronLeft size={20} />
          </button>
        )}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 btn-icon shadow-lg bg-card"
          >
            <FiChevronRight size={20} />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar scroll-smooth"
        >
          {products.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

// Product Card Component
const ProductCard = ({ product, index }) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="group block min-w-[180px] w-[180px] text-center p-4 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 rounded-lg animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative mb-3 overflow-hidden rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-36 object-contain transition-transform duration-500 group-hover:scale-110"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 badge-discount">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-brand transition-colors duration-300">
        {product.name}
      </h3>

      <div className="flex items-center justify-center gap-1 mb-2">
        <span className="rating text-xs">
          {product.rating?.toFixed(1)} <FiStar size={8} />
        </span>
        <span className="rating-count text-xs">({product.numReviews?.toLocaleString()})</span>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-1">
        <span className="price text-base">{formatPrice(product.price)}</span>
        {product.originalPrice > product.price && (
          <span className="price-discount text-xs">{product.discount}% off</span>
        )}
      </div>

      {product.freeDelivery && (
        <p className="text-xs badge-freedelivery mt-2">Free Delivery</p>
      )}
    </Link>
  );
};

export default Home;
