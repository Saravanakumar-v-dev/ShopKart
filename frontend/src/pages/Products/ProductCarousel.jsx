import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

// Custom Arrow Components
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-dark-100/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-600 transition-all duration-300 hover:scale-110"
  >
    <FaArrowLeft size={16} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-dark-100/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary-600 transition-all duration-300 hover:scale-110"
  >
    <FaArrowRight size={16} />
  </button>
);

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    dotsClass: "slick-dots custom-dots",
  };

  if (isLoading) return null;

  if (error) {
    return (
      <Message variant="danger">
        {error?.data?.message || error.error}
      </Message>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <style>{`
        .custom-dots {
          bottom: -40px;
        }
        .custom-dots li button:before {
          color: #71717a;
          font-size: 10px;
          opacity: 0.5;
        }
        .custom-dots li.slick-active button:before {
          color: #8b5cf6;
          opacity: 1;
        }
      `}</style>

      <Slider {...settings}>
        {products.map((product) => (
          <div key={product._id} className="outline-none">
            <div className="glass-card overflow-hidden rounded-2xl">
              {/* Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-50 via-transparent to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                    <div className="flex-1">
                      {/* Brand Badge */}
                      <span className="badge badge-primary mb-3">
                        {product.brand}
                      </span>

                      {/* Title */}
                      <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                        {product.name}
                      </h2>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < Math.round(product.rating)
                                  ? "text-yellow-400"
                                  : "text-dark-400"
                              }
                              size={14}
                            />
                          ))}
                        </div>
                        <span className="text-dark-400 text-sm">
                          ({product.numReviews} reviews)
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-dark-400 text-sm lg:text-base line-clamp-2 max-w-xl">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Button */}
                    <div className="flex flex-col items-start lg:items-end gap-3">
                      <span className="text-3xl lg:text-4xl font-bold text-gradient">
                        ₹{product.price}
                      </span>
                      <Link
                        to={`/product/${product._id}`}
                        className="btn-primary flex items-center gap-2"
                      >
                        <span>View Details</span>
                        <FaArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
