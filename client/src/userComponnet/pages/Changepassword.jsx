import ProfileComponent from '@/Reusable/ProfileComponent';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import instance from '@/instance';
import { useSelector } from 'react-redux';
import Navbar from '@/Reusable/Navbar';
import { changePassword } from '@/User_apiservices/password';

function Changepassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const user = useSelector((state) => state.user.userInfo);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match!');
        return;
      }

      const hasLetter = /[a-zA-Z]/.test(newPassword);
      const hasNumber = /\d/.test(newPassword);
      if (!(hasLetter && hasNumber)) {
        toast.error('password should contain letter and number');
        return;
      }

      await changePassword(
        user._id,
        newPassword,
        setNewPassword,
        setConfirmPassword,
        toast
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar user={user ? user.name : null} />
      <div className="flex">
        <ProfileComponent />
        <motion.div
          className="bg-white ml-64 p-8 flex-1 min-h-screen  pt-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="max-w-md mx-auto">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-red-950 font-semibold">
                  New Password:
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>
              <Toaster position="top-center" richColors />
              <div>
                <label className="block text-red-950 font-semibold">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Changepassword;
