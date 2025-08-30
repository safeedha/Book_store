import React, { useEffect, useState } from 'react';
import ProfileComponent from '@/Reusable/ProfileComponent';
import Navbar from '@/Reusable/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getWalletinformation } from '../../User_apiservices/wallet';
import { useRazorpay } from 'react-razorpay';
import { addMoneyWallet } from '../../User_apiservices/wallet';
import { set } from 'lodash';
function Wallet() {
  const user = useSelector((state) => state.user.userInfo);
  const [wallet, setWallet] = useState([]);
  const [balence, setBalence] = useState();
  const [buttonText, setButtonText] = useState('Show transaction history');
  const [add, setAdd] = useState(false);
  const [amount, setAmount] = useState(0);
  const { Razorpay } = useRazorpay();

  useEffect(() => {
    const fetchUserWallet = async () => {
      await getWalletinformation(setWallet);
    };
    fetchUserWallet();
  }, [add]);

  const addHandle = () => {
    setAdd(true);
  };
  const cancelHandle = () => {
    setAdd(false);
  };

  const addMoney = async (e) => {
    try {
      e.preventDefault();
      await addMoneyWallet(Razorpay, amount, setAdd);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const sum = wallet.reduce((accumulator, current) => {
      if (current.transactionType === 'credit') {
        return accumulator + current.amount; // Return the updated value
      }
      if (current.transactionType === 'debit') {
        return accumulator - current.amount; // Return the updated value
      }
      return accumulator;
    }, 0);

    setBalence(sum);
  }, [wallet]);

  const walletHandle = () => {
    if (buttonText === 'Show transaction history') {
      setButtonText('hide');
    }
    if (buttonText === 'hide') {
      setButtonText('Show transaction history');
    }
  };

  const transaction_history = wallet.map((item, index) => (
    <div
      key={index}
      className="bg-slate-300 p-4 m-2 rounded-md shadow-md flex flex-col"
    >
      <div className="flex justify-between items-center mb-2">
        <p className="text-lg font-semibold">{item.transactionType}</p>
        <p className="text-sm text-gray-600">
          {new Date(item.date).toLocaleDateString()}
        </p>
      </div>

      <div>
        <p className="text-lg">
          Amount:<span className="text-red-600"> &#8377;{item.amount}</span>
        </p>
      </div>
    </div>
  ));

  return (
    <>
      <Navbar user={user ? user.name : null} />
      <div className="flex">
        <ProfileComponent />
        <motion.div
          className="bg-slate-50  ml-64 p-8 flex-1 min-h-screen pt-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {wallet.length === 0 && (
            <div className="flex flex-col items-center justify-center space-y-6 bg-gray-100 p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Wallet is Empty
              </h2>
              <p className="text-gray-600">
                It looks like you haven’t added any funds yet. Start adding
                money to your wallet now!
              </p>
              <button
                className="px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all ml-4"
                onClick={addHandle}
              >
                ADD MONEY
              </button>
            </div>
          )}
          <div className="flex flex-col items-center justify-center space-y-6"></div>
          {wallet.length === 0 && add && (
            <div className="flex flex-col items-center justify-center space-y-6">
              <form
                className="mt-4 flex flex-col items-center gap-4"
                onSubmit={addMoney}
              >
                <input
                  type="number"
                  placeholder="Enter amount"
                  required
                  min="1"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="flex gap-4">
                  <input
                    type="submit"
                    value="Submit"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all cursor-pointer"
                  />
                  <button
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all"
                    onClick={cancelHandle}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          <br></br>
          {wallet.length > 0 && (
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="bg-slate shadow-lg rounded-lg w-80 h-60 p-6 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-700 mb-4">
                  Wallet Balance
                </h1>
                <p className="text-4xl font-semibold text-green-600">
                  &#8377;{balence}
                </p>
              </div>

              <div>
                <button
                  className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
                  onClick={walletHandle}
                >
                  {buttonText}
                </button>
                <button
                  className="px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all ml-4"
                  onClick={addHandle}
                >
                  ADD MONEY
                </button>
              </div>
            </div>
          )}
          {wallet.length > 0 && add && (
            <div className="flex flex-col items-center justify-center space-y-6">
              <form
                className="mt-4 flex flex-col items-center gap-4"
                onSubmit={addMoney}
              >
                <input
                  type="number"
                  placeholder="Enter amount"
                  required
                  min="1"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="flex gap-4">
                  <input
                    type="submit"
                    value="Submit"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all cursor-pointer"
                  />
                  <button
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all"
                    onClick={cancelHandle}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {buttonText === 'hide' && (
            <div className="transaction-history mt-4 space-y-4">
              {transaction_history}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default Wallet;
