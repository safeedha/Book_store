import  { useState, useEffect } from 'react';
import ProfileComponent from '@/Reusable/ProfileComponent';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '@/Reusable/Navbar';
import {
  getAddress,
  addAddress,
  deletAddress,
} from '@/User_apiservices/Address';
import Swal from 'sweetalert2';

function Address() {
  const user = useSelector((state) => state.user.userInfo);
  const Navigate = useNavigate();
  const [add, setAdd] = useState(false);
  const [address, setAddress] = useState([]);
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
    const fetchAddress = async () => {
      try {
        await getAddress(setAddress);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
    fetchAddress();
  }, []);

  const handleChange = (e) => {
    console.log(e.target.name);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const cancelHandle = () => {
    setAdd(false);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { name, phone, streetAddress, state, district, pincode, city } =
        formData;

      if (
        name.trim().length === 0 &&
        phone.trim().length === 0 &&
        streetAddress.trim().length === 0 &&
        state.trim().length === 0 &&
        district.trim().length === 0 &&
        pincode.trim().length === 0 &&
        city.trim().length === 0
      ) {
        toast.error('all field should be required');
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
      await addAddress(
        name,
        phone,
        streetAddress,
        state,
        district,
        pincode,
        city,
        setAddress,
        setAdd,
        toast,
        setFormData
      );
    } catch (error) {
      console.log(error);
    }
  };

  const addressHandle = () => {
    setAdd(true);
  };

  const EditHandle = (id) => {
    Navigate(`/address/edit/${id}`);
  };

  const RemoveHandle = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await deletAddress(id, Swal, setAddress);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      Swal.fire(
        'Error!',
        'Failed to delete the address. Please try again.',
        'error'
      );
    }
  };

  const item = address.map((add) => (
    <div className="bg-white w-48 p-4 rounded-lg shadow-2xl" key={add._id}>
      <div className="space-y-2">
        <p className="text-lg font-semibold">{add.name}</p>
        <p className="text-sm text-gray-700 overflow-hidden">
          {add.streetAddress}
        </p>
        <p className="text-sm text-gray-700">{add.city}</p>
        <p className="text-sm text-gray-700">
          {add.state} {add.district} {add.pincode}
        </p>
        <p className="text-sm text-gray-700">Phone number: {add.phone}</p>
      </div>
      <div className="mt-4 flex justify-between text-sm text-blue-600">
        <span
          className="cursor-pointer hover:text-blue-800"
          onClick={() => EditHandle(add._id)}
        >
          Edit
        </span>
        <span
          className="cursor-pointer hover:text-red-600"
          onClick={() => RemoveHandle(add._id)}
        >
          Remove
        </span>
      </div>
    </div>
  ));

  return (
    <>
      <Navbar user={user ? user.name : null} />
      <div className="flex">
        <Toaster position="top-center" richColors />
        <ProfileComponent />
        <motion.div
          className="bg-white ml-64 p-8 flex-1 min-h-screen pt-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="border-2 border-indigo-600 h-16 pt-4 pl-4">
            <button
              className="text-lg font-semibold text-sky-900"
              onClick={addressHandle}
            >
              +ADD A NEW ADDRESS
            </button>
          </div>

          {add && (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 border-indigo-600 mt-2"
            >
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
                />
              </div>

              {/* City, State, District, and Pincode in the same line */}
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
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-1/2 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-4"
              >
                Save Address
              </button>
              <button
                type="button"
                className="w-1/4 py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={cancelHandle}
              >
                Cancel
              </button>
            </form>
          )}

          {/* Display all addresses */}
          <div className="grid grid-cols-4 gap-4 mt-4">{item}</div>
        </motion.div>
      </div>
    </>
  );
}

export default Address;
