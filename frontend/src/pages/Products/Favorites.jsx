import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="ml-[5rem] lg:ml-[5rem] min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Your Favorites</span>
          </h1>
          <p className="text-dark-500">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {favorites.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-32 h-32 mb-8 rounded-full bg-dark-200 flex items-center justify-center">
              <FaHeart className="w-16 h-16 text-dark-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">No favorites yet</h2>
            <p className="text-dark-500 mb-8 text-center max-w-md">
              Start adding products to your favorites by clicking the heart icon on any product.
            </p>
            <Link to="/shop" className="btn-primary flex items-center gap-2">
              <span>Browse Products</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product, index) => (
              <div
                key={product._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Product product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
