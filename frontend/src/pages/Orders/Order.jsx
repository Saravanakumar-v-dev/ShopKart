import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal && order.paymentMethod !== "CashOnDelivery") {
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="bg-gray-100 min-h-screen pb-10">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Order ID: {order._id}</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Details */}
          <div className="md:w-2/3 space-y-6">

            {/* Shipping Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Shipping Details</h2>
              <div className="mb-4">
                <strong className="block text-gray-700">Name:</strong>
                <span className="text-gray-600">{order.user.username}</span>
              </div>
              <div className="mb-4">
                <strong className="block text-gray-700">Email:</strong>
                <span className="text-gray-600">{order.user.email}</span>
              </div>
              <div className="mb-4">
                <strong className="block text-gray-700">Address:</strong>
                <span className="text-gray-600">
                  {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                </span>
              </div>

              <div className="mt-4">
                {order.isDelivered ? (
                  <Messsage variant="success">Delivered on {order.deliveredAt}</Messsage>
                ) : (
                  <Messsage variant="danger">Not Delivered</Messsage>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Payment Details</h2>
              <div className="mb-4">
                <strong className="block text-gray-700">Method:</strong>
                <span className="text-gray-600">{order.paymentMethod}</span>
              </div>

              <div className="mt-4">
                {order.isPaid ? (
                  <Messsage variant="success">Paid on {order.paidAt}</Messsage>
                ) : (
                  <Messsage variant={order.paymentMethod === 'CashOnDelivery' ? "warning" : "danger"}>
                    {order.paymentMethod === 'CashOnDelivery' ? 'Pay on Delivery' : 'Not Paid'}
                  </Messsage>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Messsage>Order is empty</Messsage>
              ) : (
                <div className="divide-y divide-gray-200">
                  {order.orderItems.map((item, index) => (
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
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">₹{item.price}</span>
                          <span className="text-gray-500 text-sm">x {item.qty}</span>
                        </div>
                        <div className="mt-2 font-semibold text-gray-800">
                          Total: ₹{(item.qty * item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Price Summary & Payment */}
          <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-500 border-b pb-4 mb-4 uppercase">Order Summary</h2>

              <div className="space-y-4 text-base mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Items</span>
                  <span className="font-medium">₹{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping</span>
                  <span className="font-medium">₹{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tax</span>
                  <span className="font-medium">₹{order.taxPrice}</span>
                </div>
                <div className="border-t border-dashed border-gray-300 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-gray-800">₹{order.totalPrice}</span>
                  </div>
                </div>
              </div>

              {!order.isPaid && order.paymentMethod !== 'CashOnDelivery' && (
                <div>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div className="w-full">
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  )}
                </div>
              )}

              {loadingDeliver && <Loader />}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <div>
                  <button
                    type="button"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg text-lg mt-4 transition-colors"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
