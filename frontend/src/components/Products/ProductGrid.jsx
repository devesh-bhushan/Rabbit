import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products , loading, error }) => {
  if (loading) {
    return <p>Loading .....</p>;
  }
  if (error) {
    return <p>Error :{error}</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 ">
      {products?.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="block bg-white p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          <div className="w-full h-96 mb-4">
            <img
              src={
                product.images?.[0]?.url || "https://via.placeholder.com/300"
              }
              alt={product.images?.[0]?.altText || product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <h3 className="text-sm mb-2 font-semibold">{product.name}</h3>
          <p className="text-gray-500 font-medium text-sm tracking-tighter">
            ${product.price}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
