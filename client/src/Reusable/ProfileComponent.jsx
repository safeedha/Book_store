import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaShoppingBag,
  FaLock,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaWallet,
  FaHeart,
} from 'react-icons/fa'; // Import icons

function ProfileComponent() {
  const navigate = useNavigate();

  const AccounHandle = () => {
    navigate('/profile');
  };
  const orderHandle = () => {
    navigate('/order');
  };
  const passwordHandle = () => {
    navigate('/profile/password');
  };
  const AddressHandle = () => {
    navigate('/address');
  };
  const CartHandle = () => {
    navigate('/cart');
  };
  const WalletHandle = () => {
    navigate('/wallet');
  };
  const WishlistHandle = () => {
    navigate('/wishlist');
  };

  return (
    <div>
      <div className="fixed top-0 left-0 bottom-0 w-64 flex flex-col bg-red-100 items-center justify-flex-start px-6 py-16">
        <div
          className="mb-4 mt-4 flex items-center text-neutral-900 font-medium italic cursor-pointer hover:bg-violet-600 active:bg-violet-700 p-2 rounded"
          onClick={AccounHandle}
        >
          <FaUser className="mr-3 text-xl" /> Account Detail
        </div>
        <div
          className="mb-4 flex items-center text-neutral-900 font-medium italic cursor-pointer hover:bg-red-300 active:bg-violet-700 p-2 rounded"
          onClick={orderHandle}
        >
          <FaShoppingBag className="mr-3 text-xl" /> Orders
        </div>
        <div
          className="mb-4 flex items-center text-neutral-900 font-medium italic cursor-pointer hover:bg-red-300 active:bg-violet-700 p-2 rounded"
          onClick={passwordHandle}
        >
          <FaLock className="mr-3 text-xl" /> Password
        </div>
        <div
          className="mb-4 flex items-center text-neutral-900 font-medium italic cursor-pointer hover:bg-red-300 active:bg-violet-700 p-2 rounded"
          onClick={AddressHandle}
        >
          <FaMapMarkerAlt className="mr-3 text-xl" /> Address
        </div>
        <div
          className="mb-4 flex items-center text-neutral-900 font-medium italic cursor-pointer hover:bg-red-300 active:bg-violet-700 p-2 rounded"
          onClick={CartHandle}
        >
          <FaShoppingCart className="mr-3 text-xl" /> Cart
        </div>
        <div
          className="mb-4 flex items-center text-neutral-900 font-medium italic cursor-pointer hover:bg-red-300 active:bg-violet-700 p-2 rounded"
          onClick={WalletHandle}
        >
          <FaWallet className="mr-3 text-xl" /> Wallet
        </div>
        <div
          className="mb-4 flex items-center text-neutral-900 font-medium italic cursor-pointer hover:bg-red-300 active:bg-violet-700 p-2 rounded"
          onClick={WishlistHandle}
        >
          <FaHeart className="mr-3 text-xl" /> Wishlist
        </div>
      </div>
    </div>
  );
}

export default ProfileComponent;
