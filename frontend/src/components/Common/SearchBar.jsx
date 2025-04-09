import React, { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsByFilters,
  setFilters,
} from "../../redux/slices/productSlice";

const SearchBar = () => {
  const [searchItem, setSearchItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSearchToggle = () => setIsOpen(!isOpen);
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchItem }));
    dispatch(fetchProductsByFilters({ search: searchItem }));
    navigate(`/collections/all?search=${searchItem}`);
    handleSearchToggle();
  };

  return (
    <>
      <div
        className={`flex items-center justify-center w-full transition-all duration-300 ${
          isOpen
            ? "absolute top-0 left-0 w-full bg-[#fff] h-24 z-[50]"
            : "w-auto"
        }`}
      >
        {isOpen ? (
          <form
            className="relative flex items-center justify-center w-full"
            onSubmit={handleSearch}
          >
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder="Search"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                <HiMagnifyingGlass className="h-6 w-6" />
              </button>
            </div>
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              onClick={handleSearchToggle}
            >
              <HiMiniXMark className="h-6 w-6" />
            </button>
          </form>
        ) : (
          <button type="button">
            <HiMagnifyingGlass
              className="h-6 w-6"
              onClick={handleSearchToggle}
            />
          </button>
        )}
      </div>
    </>
  );
};

export default SearchBar;
