import React from "react";
import {
  HiShoppingBag,
  HiArrowUturnRight,
  HiOutlineCreditCard,
} from "react-icons/hi2"; // Corrected import

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Feature 1 */}
        <div className="flex flex-col items-center">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <HiShoppingBag className="text-4xl text-blue-600" />
          </div>
          <h4 className="mb-2 text-lg font-semibold">
            FREE INTERNATIONAL SHIPPING
          </h4>
          <p className="text-sm text-gray-600">On all Orders over $100.00</p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <HiArrowUturnRight className="text-4xl text-green-600" />
          </div>
          <h4 className="mb-2 text-lg font-semibold">45 DAYS RETURN</h4>
          <p className="text-sm text-gray-600">Money back guarantee</p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <HiOutlineCreditCard className="text-4xl text-red-600" />
          </div>
          <h4 className="mb-2 text-lg font-semibold">SECURE CHECKOUT</h4>
          <p className="text-sm text-gray-600">100% secured checkout process</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
