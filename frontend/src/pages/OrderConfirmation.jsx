import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const calculateEstimatedDelivery = (createdAt) => {
  const orderDate = new Date(createdAt);
  orderDate.setDate(orderDate.getDate() + 10);
  return orderDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const OrderConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);
  return (
    <div className="mx-auto max-w-4xl p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You For Your Order
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border">
          {/* Order Details */}
          <div className="flex justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Order Date: {new Date(checkout.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-emerald-700">
                <span className="font-semibold">Estimated Delivery:</span>{" "}
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
            {checkout.checkoutItems.map((item, index) => (
              <div key={index} className="flex items-center border-b py-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-gray-500 text-sm">
                    Color: {item.color} | Size: {item.size}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md font-semibold">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment & Shipping Information */}
          <div className="grid grid-cols-2 gap-8 mt-4">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
              <p className="text-gray-600">{checkout.paymentMethod}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Shipping Address</h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Total Price */}
          <div className="border-t pt-4 mt-4 flex justify-between text-lg font-semibold">
            <p>Total</p>
            <p>
              ${calculateTotalPrice(checkout.checkoutItems).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
