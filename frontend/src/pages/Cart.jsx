import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiCheck, FiTruck } from "react-icons/fi";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import { formatPrice } from "../Utils/currency";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const updateQuantity = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const totalDiscount = cartItems.reduce((acc, item) => {
    const original = item.originalPrice || item.price;
    return acc + item.qty * (original - item.price);
  }, 0);

  return (
    <div className="bg-primary min-h-screen py-4">
      <div className="max-w-5xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-secondary mb-4 animate-fade-in">
          <Link to="/" className="hover:text-brand transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <span>Shopping Cart</span>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="card-elevated p-16 text-center animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <FiShoppingBag size={40} className="text-brand" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-secondary mb-8">Looks like you haven't added anything yet</p>
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="card-elevated overflow-hidden">
                <div className="p-4 border-b border-default flex items-center justify-between bg-tertiary">
                  <h2 className="font-semibold">My Cart ({totalItems})</h2>
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <FiTruck size={16} className="text-brand" />
                    <span>Deliver to: Home</span>
                  </div>
                </div>

                {cartItems.map((item, index) => (
                  <div
                    key={item._id}
                    className="p-4 border-b border-default hover:bg-hover transition-colors duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <Link
                        to={`/product/${item._id}`}
                        className="shrink-0 group"
                      >
                        <div className="w-28 h-28 rounded-lg overflow-hidden border border-default">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1">
                        <Link to={`/product/${item._id}`}>
                          <h3 className="font-medium hover:text-brand line-clamp-2 transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-secondary text-sm mt-1">{item.brand}</p>

                        <div className="flex items-center gap-2 mt-3">
                          <span className="price text-lg">{formatPrice(item.price)}</span>
                          {item.originalPrice > item.price && (
                            <>
                              <span className="price-original">{formatPrice(item.originalPrice)}</span>
                              <span className="price-discount">{item.discount}% off</span>
                            </>
                          )}
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex items-center gap-6 mt-4">
                          <div className="flex items-center border-2 border-default rounded-lg overflow-hidden">
                            <button
                              onClick={() => item.qty > 1 && updateQuantity(item, item.qty - 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-hover transition-colors disabled:opacity-50"
                              disabled={item.qty <= 1}
                            >
                              <FiMinus size={16} />
                            </button>
                            <span className="w-14 text-center font-semibold border-x-2 border-default py-2">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => item.qty < item.countInStock && updateQuantity(item, item.qty + 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-hover transition-colors disabled:opacity-50"
                              disabled={item.qty >= item.countInStock}
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-secondary hover:text-error font-semibold text-sm uppercase tracking-wide transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Place Order Button - Mobile */}
                <div className="p-4 lg:hidden sticky bottom-0 bg-card border-t border-default">
                  <button
                    onClick={checkoutHandler}
                    className="w-full btn btn-cart py-4 text-base"
                  >
                    Place Order <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="lg:w-80 shrink-0">
              <div className="card-elevated sticky top-24 overflow-hidden">
                <div className="p-4 border-b border-default bg-tertiary">
                  <h3 className="text-secondary font-semibold uppercase text-sm tracking-wide">
                    Price Details
                  </h3>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Price ({totalItems} items)</span>
                    <span>{formatPrice(totalPrice + totalDiscount)}</span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm animate-fade-in">
                      <span>Discount</span>
                      <span className="text-success font-medium">-{formatPrice(totalDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Delivery Charges</span>
                    <span className="text-success font-medium">FREE</span>
                  </div>

                  <div className="border-t-2 border-dashed border-default pt-4 flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                      <FiCheck className="text-success" size={18} />
                      <span className="text-success text-sm font-medium">
                        You will save {formatPrice(totalDiscount)} on this order
                      </span>
                    </div>
                  )}
                </div>

                {/* Place Order Button - Desktop */}
                <div className="p-4 border-t border-default hidden lg:block">
                  <button
                    onClick={checkoutHandler}
                    className="w-full btn btn-cart py-4 text-base"
                  >
                    Place Order <FiArrowRight />
                  </button>
                </div>

                {/* Security Badge */}
                <div className="p-4 pt-0 text-center">
                  <p className="text-xs text-muted flex items-center justify-center gap-2">
                    <span>🔒</span>
                    Safe and Secure Payments
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
