import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import LOGO from '../assets/logo.webp';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../feature/userSlice';
import instance from '@/instance';
import { useSelector } from 'react-redux';
import { cartQuantityUpdate } from '../feature/cartSlice';
import { useContext } from 'react';
import { shopcontext } from '../context/Shopcontex';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

const Navbar = ({ user }) => {
  const { search, setSearch } = useContext(shopcontext);
  const navigate = useNavigate();
  const cartquantity = useSelector((state) => state.cart.quantity);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const [cart, setCart] = useState(0);

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (user) {
        try {
          const response = await instance.get('/user/status');
        } catch (error) {
          if (
            error.response.data.message ===
            'Invalid refresh token. Please log in again.'
          ) {
            dispatch(logoutUser());
            return;
          }
          if (error.response.data.message === 'User blocked') {
            dispatch(logoutUser());
            return;
          }
        }
      }
    };
    fetchUserStatus();
  }, [user]);

  useEffect(() => {
    if (user) {
      getQuantitCart();
    }
  }, [cartquantity]);

  const getQuantitCart = async () => {
    try {
      const response = await instance.get('/user/cart/quantity');
      if (response.status === 200) {
        setCart(response.data.count);
        dispatch(cartQuantityUpdate(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    navigate('/product');
  };

  return (
    <nav className="bg-red-500 p-4 shadow-lg fixed z-50 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <img src={LOGO} alt="Logo" className="h-10 w-10" />
          <span className="text-white text-2xl font-bold tracking-wide">
            BOOK LOOM
          </span>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search books..."
            className="w-full px-4 py-2 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search books"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-blue-300 font-medium">
            Home
          </Link>
          <Link
            to="/#about"
            className="text-white hover:text-blue-300 font-medium"
          >
            About
          </Link>
          {user ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-white hover:text-blue-300 font-medium focus:outline-none"
              >
                Welcome, {user}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white hover:text-blue-300 font-medium"
            >
              Login
            </Link>
          )}
          <Link
            to="/product"
            className="text-white hover:text-blue-300 font-medium"
          >
            ProductList
          </Link>
          {/* <Link to="/contact" className="text-white hover:text-blue-300 font-medium">Contact</Link> */}
          <Link to="/cart" className="relative">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACTElEQVR4nO2ZzUuUQRyAn62gCDtn4F6CcjMlRLz0FxTRsdUOhqEhhkgIgbf+gg5B4MFLh8g+1JAlvRQR3b14kKBTKumSWOFBcLdi4Lfwsrwfu+v8Zt4XemAu78yPmWdm3vlg4D/p4wawCfyNSXvAJ+AOkCOlbCRI1KdnaZXZCDTyW0SZs8AIsC/lzMikjusiYySuJZQdFZFVMs5J4IfIXG4ytgi8BwoR+beA5Zh86zwXkYkmYgaAQ4nbAbpDJOPyVahNr/kGyw8BlboFYxvokvw24HtMvhoXpbJyA6vXYKCn61Ow5wshMjsuRmZLKovrtdshIxEm05Mg06Mp8kIquh+RfxeoNrgvlRNkypoyY1LJqyNKeJcpBIY+lbt8K/+Js3Vfi5dNTh+N9NGGyHgKRL7aEOlKgcgjGyI52YF9SfwBzmOJNx5FPmCRCY8iQzZFuj1J/AJO2xTJyaboWmQWBRY8iFzVEJl0LPFF61h0xbHINErkAvd47VQF8ijy1pHICso8cCRS1BbpdSCxC5zSFjkmFWmKPMURS8oifa5EphQl1nBIn6LIlEuR4/KOYlviEGjHMSWFy9MTPPBQGjBDxukXkXUyzgm59JgpcY6MU5JRGSbj3BMR8wqcac4EjvWPgUsuzkha3AQOLC7Dn33L2BKpAB2+RGqPpu+kER3yamu+zUXEzLUQo07tsSbYk3n5Zo78YezGxJhl3Qu/Yxr102KMOovSgGVpTF7u3HFP24stxKjTGXFrNN8uWIzBBWaKvJb5bZLp1aQGtRLDP753M+G6dfn9AAAAAElFTkSuQmCC"
              alt="shopping-cart-loaded--v1"
              className="w-10 h-10"
            />

            <div className="absolute top-0 right-0 bg-red-300 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cart}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
