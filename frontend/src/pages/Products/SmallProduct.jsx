import { Link } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="block p-3 hover:shadow-card transition-shadow group"
    >
      <div className="relative mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-28 object-contain group-hover:scale-105 transition-transform"
        />
      </div>

      <h3 className="text-sm line-clamp-2 mb-1 group-hover:text-brand">
        {product.name}
      </h3>

      <div className="flex items-center gap-1 mb-1">
        <span className="rating text-xs">
          {product.rating?.toFixed(1)} <FiStar size={8} />
        </span>
      </div>

      <span className="font-medium">₹{product.price}</span>
    </Link>
  );
};

export default SmallProduct;
