import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="container mx-auto px-4 py-8">
        <ProgressSteps step1 step2 step3 />

        {cart.cartItems.length === 0 ? (
          <div className="mt-8">
            <Message>Your cart is empty</Message>
          </div>
        ) : (
          <div className="mt-8 flex flex-col md:flex-row gap-6">
            {/* Left Column: Address & Items */}
            <div className="md:w-2/3 space-y-6">
              {/* Shipping Address Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Delivery Address</h2>
                  <button
                    onClick={() => navigate('/shipping')}
                    className="text-blue-600 font-semibold text-sm hover:underline"
                  >
                    CHANGE
                  </button>
                </div>
                <div className="ml-2">
                  <p className="font-semibold text-lg mb-1">{cart.shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {cart.shippingAddress.city} - {cart.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-600 mb-2">{cart.shippingAddress.country}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-semibold text-gray-700">Payment Method:</span> {cart.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Order Items Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
                <div className="divide-y divide-gray-200">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="py-4 flex items-start gap-4">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="flex-1">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-gray-800 font-medium hover:text-blue-600 text-lg block mb-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-500 text-sm mb-2">Quantity: {item.qty}</p>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">₹{item.price.toFixed(2)}</span>
                          <span className="text-gray-500 text-sm">per item</span>
                        </div>

                        <div className="mt-2 font-semibold text-gray-800">
                          Total: ₹{(item.qty * item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Price Details */}
            <div className="md:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                <h2 className="text-xl font-bold text-gray-500 border-b pb-4 mb-4 uppercase">Price Details</h2>

                <div className="space-y-4 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Price ({cart.cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                    <span className="font-medium">₹{cart.itemsPrice}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-700">Delivery Charges</span>
                    <span className="font-medium text-green-600">
                      {Number(cart.shippingPrice) === 0 ? "FREE" : `₹${cart.shippingPrice}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-700">Tax</span>
                    <span className="font-medium">₹{cart.taxPrice}</span>
                  </div>

                  <div className="border-t border-dashed border-gray-300 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total Amount</span>
                      <span className="text-xl font-bold text-gray-800">₹{cart.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4">
                    <Message variant="danger">{error.data.message}</Message>
                  </div>
                )}

                <button
                  type="button"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold py-4 rounded-sm shadow-md mt-8 uppercase tracking-wide transition-colors"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default PlaceOrder;
