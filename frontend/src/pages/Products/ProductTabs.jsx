import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import { FiStar } from "react-icons/fi";
import { mockProducts } from "../../Utils/mockData";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  // Use API data or mock data
  const relatedProducts = data?.length > 0 ? data : mockProducts.slice(0, 6);

  const tabs = [
    { id: 1, label: "Reviews" },
    { id: 2, label: "Write Review" },
    { id: 3, label: "Related Products" },
  ];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-6 border-b border-default mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-medium transition-colors relative ${activeTab === tab.id
                ? "text-brand"
                : "text-secondary hover:text-primary"
              }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {/* Reviews Tab */}
        {activeTab === 1 && (
          <div>
            {product?.reviews?.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-secondary">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {product?.reviews?.map((review) => (
                  <div key={review._id} className="border-b border-default pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="rating text-xs">
                        {review.rating} <FiStar size={8} />
                      </span>
                      <span className="font-medium text-sm">{review.name}</span>
                      <span className="text-muted text-xs">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-secondary text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Write Review Tab */}
        {activeTab === 2 && (
          <div>
            {userInfo ? (
              <form onSubmit={submitHandler} className="max-w-lg">
                <div className="mb-4">
                  <label className="form-label">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <FiStar
                          size={24}
                          className={star <= rating ? "text-warning fill-current" : "text-muted"}
                          fill={star <= rating ? "currentColor" : "none"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="comment" className="form-label">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-input resize-none"
                    placeholder="Share your experience with this product..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="btn btn-primary"
                >
                  {loadingProductReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="text-center py-10">
                <p className="text-secondary mb-4">
                  Please login to write a review
                </p>
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Related Products Tab */}
        {activeTab === 3 && (
          <div>
            {isLoading ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {relatedProducts.map((product) => (
                  <SmallProduct key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
