import  { useEffect } from 'react';
import Navbar from '@/Reusable/Navbar';

import Footer from '@/Reusable/Footer';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

function Order_confirm() {
  const user = useSelector((state) => state.user.userInfo);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!location.state?.fromCheckout) {
      navigate('/checkout');
      return null;
    }
  }, [location.state?.fromCheckout,navigate]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user ? user.name : null} />
        <div className="flex-grow bg-gray-100 flex flex-col items-center justify-center text-center">
          <div className="shadow-lg bg-white p-8 rounded-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">
              Your Order Placed!
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Thank you for shopping with us! 😊
            </p>
            <div className="space-x-4">
              <button
                className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                onClick={() => navigate('/order')}
              >
                Go to My Orders
              </button>
              <button
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                onClick={() => navigate('/product')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Order_confirm;
