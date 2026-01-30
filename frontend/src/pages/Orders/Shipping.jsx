import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  // Payment
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProgressSteps step1 step2 />

      <div className="mt-12 flex justify-center">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Shipping Details</h1>

          <form onSubmit={submitHandler} className="space-y-5">
            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-2">Address</label>
              <input
                type="text"
                className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                placeholder="Enter address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-2">City</label>
              <input
                type="text"
                className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                placeholder="Enter city"
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-2">Postal Code</label>
              <input
                type="text"
                className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                placeholder="Enter postal code"
                value={postalCode}
                required
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-semibold mb-2">Country</label>
              <input
                type="text"
                className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                placeholder="Enter country"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <label className="block text-lg font-bold text-gray-700 mb-3">Payment Method</label>

              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    className="form-radio text-blue-600 w-5 h-5 focus:ring-blue-500"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-3 text-gray-700 font-medium">PayPal or Credit Card</span>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    className="form-radio text-blue-600 w-5 h-5 focus:ring-blue-500"
                    name="paymentMethod"
                    value="CashOnDelivery"
                    checked={paymentMethod === "CashOnDelivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-3 text-gray-700 font-medium">Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md text-lg shadow-md mt-6 transition-all transform hover:-translate-y-0.5"
              type="submit"
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
