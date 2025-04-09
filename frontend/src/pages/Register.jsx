import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../assets/register.webp";
import { registerUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckOutRedirect = redirect.includes("checkout");
  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckOutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckOutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckOutRedirect, dispatch]);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 md:px-12">
        <h2 className="text-xl font-semibold mb-4">Rabbit</h2>
        <h2 className="text-2xl font-bold text-center mb-2">Hey There! ✋</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email and password to login
        </p>

        <div className="w-full max-w-md">
          {/* name input  */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full p-2 border rounded focus:ring focus:ring-gray-400"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-2 border rounded focus:ring focus:ring-gray-400"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border rounded focus:ring focus:ring-gray-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Sign up Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            aria-label="Sign in to your account"
          >
            {loading ? "loading..." : "Sign Up"}
          </button>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:flex w-1/2 bg-gray-800 items-center justify-center">
        <img
          src={register}
          alt="Login to Account"
          className="h-[600px] w-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default Register;
