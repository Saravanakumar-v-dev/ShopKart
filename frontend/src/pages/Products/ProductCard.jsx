import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Added to cart!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="glass-card overflow-hidden group">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${p._id}`}>
          <img
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
            src={p.image}
            alt={p.name}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-50/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Brand Badge */}
        {p?.brand && (
          <span className="absolute top-3 left-3 badge badge-primary">
            {p.brand}
          </span>
        )}

        {/* Heart Icon */}
        <HeartIcon product={p} />
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title & Price */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary-400 transition-colors">
            {p?.name}
          </h3>
          <span className="text-lg font-bold text-primary-400 whitespace-nowrap">
            ₹{p?.price?.toFixed(2)}
          </span>
        </div>

        {/* Description */}
        <p className="text-dark-500 text-sm mb-4 line-clamp-2">
          {p?.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to={`/product/${p._id}`}
            className="flex-1 btn-secondary text-center py-2 text-sm"
          >
            View Details
          </Link>

          <button
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center hover:shadow-glow transition-all duration-300 hover:scale-105"
            onClick={() => addToCartHandler(p, 1)}
            title="Add to Cart"
          >
            <AiOutlineShoppingCart size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
