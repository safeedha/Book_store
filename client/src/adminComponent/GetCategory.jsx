import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import Pagination from '@/Reusable/Pagination';
import {
  getAllCategory,
  categoryBlock,
  AddofferfromCategory,
} from './AdminApi/Category';
import Modal from 'react-modal';
import Swal from 'sweetalert2';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
function GetCategory() {
  let subtitle;
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [category, setCategory] = useState([]);
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [catid, SetcatId] = useState('');
  const [catname, setCatname] = useState('');
  const [page,setPage]=useState(1)
  const [totalpage,setTotalpage]=useState(0)
  const rowsPerPage = 3;

  function Addoffer(id) {
    setIsOpen(true);
    SetcatId(id);
  }

  function afterOpenModal() {
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const addCategory = () => {
    navigate('/admin/category/add');
  };

  const offernSubmit = async (e) => {
    e.preventDefault();
    await AddofferfromCategory(
      catid,
      name,
      expiryDate,
      discount,
      setIsOpen,
      toast
    );
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        await getAllCategory(setCategory,page,rowsPerPage,setTotalpage);
      } catch (error) {
        toast.error('Error fetching category data');
      }
    };
    fetchCategory();
  }, [page]);


  const Editblock = async (id) => {
    const current = category.find((doc) => doc._id === id);
    let status = current.status === 'unblock' ? 'block' : 'unblock';

    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to ${status} this category.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!',
        cancelButtonText: 'Cancel',
      });
      if (result.isConfirmed) {
        await categoryBlock(id, setCategory, Swal, status, category);
      }
    } catch (error) {
      toast.error('Some error occurred. Try later.');
    }
  };

  const Edithandle = (id) => {
    navigate(`/admin/category/${id}`);
  };

  const Search = () => {
    const filtered = category.filter((doc) =>
      doc.name.toLowerCase().includes(catname.toLowerCase())
    );

    // Sort the filtered data to make the first row the matching product
    const sorted = [
      ...filtered,
      ...category.filter(
        (doc) => !doc.name.toLowerCase().includes(catname.toLowerCase())
      ),
    ];

    setCategory(sorted);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Toaster position="top-center" richColors />
      <Sidebar />
      <div className="bg-gray-200 min-h-screen min-w-full">
        <div className="flex-1 ml-64 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Category Management</h2>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter name..."
                onChange={(e) => setCatname(e.target.value)}
              />
              <button
                onClick={Search}
                className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700 transition-all duration-200"
              >
                Search
              </button>
            </div>
            <button
              onClick={addCategory}
              className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700 transition-all duration-200"
            >
              ADD CATEGORY
            </button>
          </div>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-500 px-4 py-2">Category</th>
                <th className="border border-gray-500 px-4 py-2">
                  Category Image
                </th>
                <th className="border border-gray-500 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {category.map((doc) => (
                <tr
                  key={doc._id}
                  className={`${doc.status !== 'unblock' ? 'bg-pink-200' : ''}`}
                >
                  <td className="border border-gray-500 px-4 py-2">
                    {doc.name}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    <div className="flex items-center justify-center">
                      <img
                        src={doc.image}
                        alt="Category"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    <button
                      onClick={() => Edithandle(doc._id)}
                      className="border border-indigo-600 bg-indigo-500 text-white rounded-full px-6 py-2 font-medium shadow-md hover:bg-indigo-600 transition-all duration-200 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => Editblock(doc._id)}
                      className="border border-indigo-600 bg-indigo-500 text-white rounded-full px-6 py-2 font-medium shadow-md hover:bg-indigo-600 transition-all duration-200 mr-4"
                    >
                      {doc.status === 'unblock' ? 'DELETE' : 'UNDO'}
                    </button>

                    <button
                      onClick={() => Addoffer(doc._id)}
                      className="border border-red-600 bg-red-500 text-white rounded-full px-6 py-2 font-medium shadow-md hover:bg-red-600 transition-all duration-200 mr-4"
                    >
                      offerAdd
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={page}
            totalPages={totalpage}
            onPageChange={setPage}
          />
        </div>

        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Add Coupon Modal"
        >
          <div className="p-6 w-[400px]">
            <h2
              ref={(_subtitle) => (subtitle = _subtitle)}
              className="text-2xl font-bold text-center text-blue-600 mb-4"
            >
              Add New Offer
            </h2>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>

            <form className="space-y-4" onSubmit={offernSubmit}>
              <div>
                <label
                  htmlFor="coupenCode"
                  className="block text-gray-700 font-medium"
                >
                  Offer name
                </label>
                <input
                  type="text"
                  id="coupenCode"
                  name="coupenCode"
                  required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  placeholder="Enter offer name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <div>
                  <label
                    htmlFor="minimumPurchase"
                    className="block text-gray-700 font-medium"
                  >
                    Discount Amount
                  </label>
                  <input
                    type="number"
                    id="minimumPurchase"
                    name="discount"
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    placeholder="Enter offer in percentage"
                    onChange={(e) => setDiscount(e.target.value)}
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-gray-700 font-medium"
                  >
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    required
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default GetCategory;
