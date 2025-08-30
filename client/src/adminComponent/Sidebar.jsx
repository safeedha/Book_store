import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAdmin } from '../feature/adminSlice';
import {
  FaTachometerAlt,
  FaUser,
  FaProductHunt,
  FaBox,
  FaTags,
  FaGift,
  FaFireAlt,
  FaChartLine,
} from 'react-icons/fa';

const Sidebar = () => {
  const admin = useSelector((state) => state.admin.adminInfo);
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Sales Report', path: '/admin/sales', icon: <FaTachometerAlt /> },
    { name: 'Customer', path: '/admin/customer', icon: <FaUser /> },
    { name: 'Product', path: '/admin/product', icon: <FaProductHunt /> },
    { name: 'Orders', path: '/admin/orders', icon: <FaBox /> },
    { name: 'Category', path: '/admin/category', icon: <FaTags /> },
    { name: 'Coupen', path: '/admin/coupen', icon: <FaGift /> },
    { name: 'Offer', path: '/admin/offer', icon: <FaFireAlt /> },
    { name: 'Trending', path: '/admin/trending', icon: <FaChartLine /> },
  ];

  const Logout = () => {
    dispatch(logoutAdmin());
  };

  const Login = () => {
    Navigate('/admin/login');
  };

  return (
    <div className="fixed w-48 h-screen bg-gray-800 text-white flex flex-col justify-between">
      <ul className="mt-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className="flex items-center p-4 hover:bg-gray-700 rounded transition duration-300"
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="p-4">
        {admin ? (
          <button
            onClick={Logout}
            className="w-1/2 px-2 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 mb-4"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={Login}
            className="w-full px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 mb-4"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
