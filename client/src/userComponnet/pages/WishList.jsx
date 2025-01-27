import React, { useEffect, useState } from 'react';
import Navbar from '@/Reusable/Navbar';
import { useSelector } from 'react-redux';
import ProfileComponent from '@/Reusable/ProfileComponent';
import { motion } from 'framer-motion';
import { getWishList, delteFromwishlist } from '@/User_apiservices/wishlist';
import { useNavigate } from 'react-router-dom';
import UserPagination from '@/Reusable/UserPagination';
import { useDispatch } from 'react-redux';
import {logoutUser} from '../../feature/userSlice'

function WishList() {
  const user = useSelector((state) => state.user.userInfo);
  const [wish, setWish] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Number of items per page
  const navigate = useNavigate();
  const dispatch=useDispatch()

  useEffect(() => {
    const fetchWishList = async () => {
      try {
        await getWishList(setWish,dispatch,logoutUser);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    fetchWishList();
  }, []);

  const deleteHandle = async (id) => {
    await delteFromwishlist(id, setWish);
  };

  const singleProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const totalPages = Math.ceil(wish.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = wish.slice(startIndex, endIndex);

  const wishedItem = currentItems.map((item) => (
    <div
      className="bg-white shadow-md flex items-center p-4 rounded-md mb-4"
      key={item.productId._id}
      onClick={() => singleProduct(item.productId._id)}
    >
      <img
        src={item.productId.images[0]}
        alt={item.productId.name}
        className="w-24 h-24 object-cover rounded-md"
      />
      <div className="ml-4 flex-grow">
        <p className="text-lg font-semibold text-gray-800">
          {item.productId.name}
        </p>
        {!item.productId.offerId ? (
          <p className="text-md text-green-600 mt-1">
            ${item.productId.price}
          </p>
        ) : new Date(item.productId.offerId.expiryDate) > new Date() ? (
          <div>
            <p className="text-md text-red-600 mt-1 line-through">
              ${item.productId.price}
            </p>
            <p className="text-md text-green-600 mt-1">
              $
              {item.productId.price -
                (item.productId.price *
                  item.productId.offerId.offerAmount) /
                  100}
            </p>
          </div>
        ) : (
          <p className="text-md text-gray-600 mt-1">
            ${item.productId.price}
          </p>
        )}
      </div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 100 100"
          className="cursor-pointer hover:scale-110 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            deleteHandle(item.productId._id);
          }}
        >
          <path
            fill="#f37e98"
            d="M25,30l3.645,47.383C28.845,79.988,31.017,82,33.63,82h32.74c2.613,0,4.785-2.012,4.985-4.617L75,30"
          ></path>
          <path
            fill="#f15b6c"
            d="M65 38v35c0 1.65-1.35 3-3 3s-3-1.35-3-3V38c0-1.65 1.35-3 3-3S65 36.35 65 38zM53 38v35c0 1.65-1.35 3-3 3s-3-1.35-3-3V38c0-1.65 1.35-3 3-3S53 36.35 53 38zM41 38v35c0 1.65-1.35 3-3 3s-3-1.35-3-3V38c0-1.65 1.35-3 3-3S41 36.35 41 38zM77 24h-4l-1.835-3.058C70.442 19.737 69.14 19 67.735 19h-35.47c-1.405 0-2.707.737-3.43 1.942L27 24h-4c-1.657 0-3 1.343-3 3s1.343 3 3 3h54c1.657 0 3-1.343 3-3S78.657 24 77 24z"
          ></path>
          <path
            fill="#1f212b"
            d="M66.37 83H33.63c-3.116 0-5.744-2.434-5.982-5.54l-3.645-47.383 1.994-.154 3.645 47.384C29.801 79.378 31.553 81 33.63 81H66.37c2.077 0 3.829-1.622 3.988-3.692l3.645-47.385 1.994.154-3.645 47.384C72.113 80.566 69.485 83 66.37 83z"
          ></path>
        </svg>
      </div>
    </div>
  ));

  return (
    <>
      <Navbar user={user ? user.name : null} />
      <div className="flex">
        <ProfileComponent />
        <motion.div
          className=" ml-64 p-8 flex-1 min-h-screen bg-slate-50 pt-20 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="grid grid-cols-2 gap-1 mt-10">{wishedItem}</div>
          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </motion.div>
      </div>
    </>
  );
}

export default WishList;
