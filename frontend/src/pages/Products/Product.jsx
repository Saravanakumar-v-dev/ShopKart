import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { formatPrice } from "../../Utils/currency";

const Product = ({ product }) => {
  return (
    <div className="glass-card overflow-hidden group">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-50/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Brand Badge */}
        {product?.brand && (
          <span className="absolute top-3 left-3 badge badge-primary">
            {product.brand}
          </span>
        )}

        {/* Heart Icon */}
        <HeartIcon product={product} />

        {/* Quick View on Hover */}
        <Link
          to={`/product/${product._id}`}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 btn-primary py-2 px-4 text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300"
        >
          Quick View
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold line-clamp-1 group-hover:text-primary-400 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <span className="text-lg font-bold text-gradient">
          {formatPrice(product.price)}
        </span>
      </div>
    </div>
  );
};

export default Product;
