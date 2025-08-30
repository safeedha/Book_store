import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import instance from '@/instance';
import { useNavigate, useParams } from 'react-router-dom';
import { getoneAddress, updateAddress } from '../../User_apiservices/Address';
import ProfileComponent from '@/Reusable/ProfileComponent';
import Navbar from '@/Reusable/Navbar';
import { useSelector } from 'react-redux';
function Editaddress() {
  const { id } = useParams();
  const Navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    streetAddress: '',
    state: '',
    district: '',
    pincode: '',
    city: '',
  });

  useEffect(() => {
    const getSingleAddress = async () => {
      try {
        await getoneAddress(setFormData, id);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };
    if (id) {
      getSingleAddress();
    }
  }, [id]);

  const handleChange = (e) => {
    console.log(e.target.name);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const cancelEdit = () => {
    Navigate(-1);
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { name, phone, streetAddress, state, district, pincode, city } =
        formData;
      if (
        name.trim().length === 0 ||
        phone.trim().length === 0 ||
        streetAddress.trim().length === 0 ||
        state.trim().length === 0 ||
        district.trim().length === 0 ||
        pincode.trim().length === 0 ||
        city.trim().length === 0
      ) {
        toast.error('All fields should be filled');
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone.trim())) {
        toast.error('Phone number must contain exactly 10 digits');
        return;
      }

      const pin = /^[0-9]{6}$/;
      if (!pin.test(pincode.trim())) {
        toast.error('Pin code should be 6 digits');
        return;
      }
      await updateAddress(
        id,
        toast,
        Navigate,
        name,
        phone,
        streetAddress,
        state,
        district,
        pincode,
        city
      );
    } catch (error) {
      console.log(error);
    }
  };
  console.log(id);
  return (
    <>
      <Navbar user={user ? user.name : null} />
      <div className="flex">
        <ProfileComponent />
        <motion.div
          className="bg-slate-50 p-8 flex-1 min-h-screen ml-64 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4  mt-2 mb-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="streetAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Street Address
              </label>
              <textarea
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows="4"
                required
              />
            </div>

            <div className="flex space-x-4">
              <div className="w-1/4">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="w-1/4">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="w-1/4">
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700"
                >
                  District
                </label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="w-1/4">
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Update Button */}
            <div className="flex justify-around">
              <button
                type="submit"
                className="w-1/3 mx-auto py-2 px-4 bg-indigo-600  text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Update Address
              </button>
              <button
                type="button"
                className="w-1/3 mx-auto py-2 px-4 bg-red-600  text-white font-semibold rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={cancelEdit}
              >
                Cancel the Edit
              </button>
            </div>

            <br></br>
            <br></br>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default Editaddress;
