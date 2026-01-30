import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import {
  FiStar,
  FiShoppingCart,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiMinus,
  FiPlus,
  FiCheck,
  FiZap,
  FiPercent,
} from "react-icons/fi";
import HeartIcon from "./HeartIcon";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { mockProducts } from "../../Utils/mockData";
import { formatPrice } from "../../Utils/currency";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const {
    data: apiProduct,
    isLoading,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const product = apiProduct || mockProducts.find(p => p._id === productId) || mockProducts[0];

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Added to cart!");
  };

  const buyNowHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/login?redirect=/shipping");
  };

  if (isLoading) return <Loader />;

  // Sample images for gallery effect
  const productImages = [product?.image, product?.image, product?.image];

  return (
    <div className="bg-primary min-h-screen py-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-secondary mb-4 animate-fade-in">
          <Link to="/" className="hover:text-brand transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/shop" className="hover:text-brand transition-colors">Shop</Link>
          <span className="mx-2">›</span>
          <span className="text-primary">{product?.brand}</span>
        </div>

        <div className="card-elevated overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left - Image Gallery */}
            <div className="relative p-6 border-r border-default bg-tertiary animate-fade-in">
              <div className="sticky top-24">
                {/* Main Image */}
                <div className="relative rounded-xl overflow-hidden mb-4 bg-white">
                  <img
                    src={productImages[selectedImage]}
                    alt={product?.name}
                    className="w-full h-80 lg:h-96 object-contain transition-transform duration-500 hover:scale-105"
                  />
                  <HeartIcon product={product} />
                  {product?.discount > 0 && (
                    <span className="absolute top-4 left-4 badge-discount px-3 py-1.5">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex gap-3 justify-center mb-6">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === idx
                        ? 'border-brand shadow-lg scale-105'
                        : 'border-default hover:border-primary'
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain bg-white" />
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={addToCartHandler}
                    disabled={product?.countInStock === 0}
                    className="flex-1 btn btn-primary py-4 text-base"
                  >
                    <FiShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <button
                    onClick={buyNowHandler}
                    disabled={product?.countInStock === 0}
                    className="flex-1 btn btn-buy py-4 text-base"
                  >
                    <FiZap size={20} />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Right - Details */}
            <div className="p-6 animate-fade-in-up">
              {/* Title & Brand */}
              <div className="mb-4">
                <span className="text-brand text-sm font-medium">{product?.brand}</span>
                <h1 className="text-xl lg:text-2xl font-semibold mt-1 leading-tight">
                  {product?.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <span className="rating px-3 py-1.5">
                  {product?.rating?.toFixed(1)} <FiStar size={12} />
                </span>
                <span className="text-secondary text-sm">
                  {product?.numReviews?.toLocaleString()} Ratings & Reviews
                </span>
                {product?.isAssured && (
                  <span className="badge-assured px-2 py-1">✓ Assured</span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold">{formatPrice(product?.price)}</span>
                  {product?.originalPrice > product?.price && (
                    <>
                      <span className="text-xl text-muted line-through">
                        {formatPrice(product?.originalPrice)}
                      </span>
                      <span className="text-success font-semibold text-lg">
                        {product?.discount}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-success text-sm mt-1 font-medium">
                  Inclusive of all taxes
                </p>
              </div>

              {/* Offers */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FiPercent className="text-brand" />
                  Available Offers
                </h3>
                <div className="space-y-3">
                  {[
                    "Bank Offer: 10% off on HDFC Credit Card, up to ₹1500",
                    "No cost EMI available on select cards",
                    "Buy 2 items get extra 5% discount",
                    "Partner Offer: Sign-up for ShopKart Pay to get cashback",
                  ].map((offer, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-sm animate-fade-in"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <FiCheck className="text-success mt-0.5 shrink-0" />
                      <span>{offer}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-6 p-4 rounded-xl bg-secondary border border-default">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                      <FiTruck className="text-brand" size={20} />
                    </div>
                    <div>
                      <span className="text-sm font-medium block">
                        {product?.freeDelivery ? 'Free Delivery' : 'Standard Delivery'}
                      </span>
                      <span className="text-xs text-secondary">
                        by {new Date(Date.now() + (product?.deliveryDays || 3) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                      <FiShield className="text-brand" size={20} />
                    </div>
                    <div>
                      <span className="text-sm font-medium block">1 Year Warranty</span>
                      <span className="text-xs text-secondary">Brand warranty</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                      <FiRefreshCw className="text-brand" size={20} />
                    </div>
                    <div>
                      <span className="text-sm font-medium block">7 Days Return</span>
                      <span className="text-xs text-secondary">Easy returns</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <span className="font-semibold mb-3 block">Quantity</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-default rounded-lg overflow-hidden">
                    <button
                      onClick={() => qty > 1 && setQty(qty - 1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-hover transition-colors"
                    >
                      <FiMinus size={18} />
                    </button>
                    <span className="w-16 text-center font-semibold text-lg border-x-2 border-default py-2">
                      {qty}
                    </span>
                    <button
                      onClick={() => qty < product?.countInStock && setQty(qty + 1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-hover transition-colors"
                    >
                      <FiPlus size={18} />
                    </button>
                  </div>
                  <span className="text-sm text-secondary">
                    {product?.countInStock > 0 ? (
                      <span className="text-success">{product?.countInStock} items in stock</span>
                    ) : (
                      <span className="text-error">Out of stock</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-secondary text-sm leading-relaxed">
                  {product?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-default p-6 bg-tertiary">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
