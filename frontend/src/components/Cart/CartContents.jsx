import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div>
      {cart.products &&
        cart.products?.map((product, index) => {
          return (
            <div
              key={index}
              className="flex items-start justify-between py-4 border-b  border-gray-200"
            >
              <div className="flex items-start">
                <img
                  className="w-20 h-24 mr-4 rounded "
                  src={product.image}
                  alt={product.name}
                />
                <div>
                  <h3>{product.name}</h3>
                  <p className="text-sm text-gray-500 ">
                    Size:{product.size} | Color:{product.color}
                  </p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        handleAddToCart(
                          product.productId,
                          -1,
                          product.quantity,
                          product.size,
                          product.color
                        )
                      }
                      type="button"
                      className="border rounded px-2 py-1 text-xl font-medium"
                    >
                      -
                    </button>
                    <span className="mx-4">{product.quantity}</span>
                    <button
                      onClick={() =>
                        handleAddToCart(
                          product.productId,
                          1,
                          product.quantity,
                          product.size,
                          product.color
                        )
                      }
                      type="button"
                      className="border rounded px-2 py-1 text-xl font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <p>$ {product.price.toLocaleString()}</p>
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveFromCart(
                      product.productId,
                      product.size,
                      product.color
                    )
                  }
                >
                  <RiDeleteBin3Line className=" text-red-600 h-6 w-6 mt-2" />
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CartContents;
