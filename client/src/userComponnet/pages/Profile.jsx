import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileComponent from '@/Reusable/ProfileComponent';
import { useSelector } from 'react-redux';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

import { setUserDetails } from '../../feature/userSlice';
import { useDispatch } from 'react-redux';

import Navbar from '@/Reusable/Navbar';
import { profileUpdate } from '../../User_apiservices/profile';

function Profile() {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
 
  const [phonenumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(true);
 
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhoneNumber(user.mobileNo);
    }
  }, [user, isEditing]);

  const editHandle = () => {
    setIsEditing(false);
  };
  const cancelEdit = () => {
    setIsEditing(true);
  };
  const handleOnsubmit = async (e) => {
    try {
      e.preventDefault();
      if (phonenumber.trim().length === 0 || name.trim().length === 0) {
        toast.error('All fields should not be empty');
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phonenumber.trim())) {
        toast.error('Phone number must contain exactly 10 digits');
        return;
      }
      let updatedData = {};

      if (user.name !== name) {
        updatedData.editedname = name;
      } else {
        console.log('Name is unchanged.');
      }

      if (user.mobileNo !== phonenumber) {
        updatedData.editednumber = phonenumber;
      } else {
        console.log('Phone number is unchanged.');
      }
      updatedData.id = user._id;
      await profileUpdate(
        updatedData,
        dispatch,
        setUserDetails,
        setIsEditing,
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
        <ProfileComponent />
        <motion.div
          className="bg-white ml-64 p-8 flex-1 min-h-screen  pt-20 mt-14" // Added background to check container size
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="max-w-md mx-auto">
            <Toaster position="top-center" richColors />
            <form className="space-y-6" onSubmit={handleOnsubmit}>
              <div>
                <label className="block text-red-950 font-semibold">
                  Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  disabled={isEditing}
                />
              </div>

              <div>
                <label className="block text-red-950 font-semibold">
                  Mobile No:
                </label>
                <input
                  type="number"
                  value={phonenumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                  disabled={isEditing}
                  required
                />
              </div>
              {isEditing && (
                <button
                  onClick={editHandle}
                  type="button"
                  className="mt-4 w-1/4 py-2 px-4 mr-1 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  Edit
                </button>
              )}
              {!isEditing && (
                <button
                  onClick={cancelEdit}
                  type="button"
                  className="mt-4 w-2/4 py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel Edit
                </button>
              )}
              {!isEditing && (
                <button
                  type="submit"
                  className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Profile;
