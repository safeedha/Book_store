import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Pagination from '@/Reusable/Pagination';
import {
  getAllproduct,
  changeStatus,
  addofferProduct,
} from './AdminApi/Product';
import Swal from 'sweetalert2';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../feature/adminSlice';

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

function GetProduct() {
  const dispatch = useDispatch();
  let subtitle;
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [productId, setProductID] = useState('');
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [name, setName] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [prodname, setProdname] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const rowsPerPage = 3;

  function afterOpenModal() {
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }
  const addProduct = () => {
    navigate('/admin/product/add');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        await getAllproduct(page,rowsPerPage,setTotalPages,setProduct, dispatch, logoutAdmin);
      } catch (error) {
        toast.error('There is an error in fetching products.');
      }
    };
    fetchProduct();
  }, [page]);
  function Addoffer(id) {
    setIsOpen(true);
    setProductID(id);
  }

 

  const Editblock = async (id) => {
    const current = product.find((doc) => doc._id === id);
    let status = current.status;
    status = status === 'unblock' ? 'block' : 'unblock';

    try {
      const result = await Swal.fire({
        title: 'Change Status',
        text: `Are you sure you want to ${status} this product?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, ${status} it!`,
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const response = changeStatus(status, dispatch, logoutAdmin);
        if (response) {
          const updatedProduct = product.map((doc) =>
            doc._id === id ? { ...doc, status } : doc
          );
          setProduct(updatedProduct);

          await Swal.fire(
            'Updated!',
            `The product has been ${status}ed successfully.`,
            'success'
          );
        }
      }
    } catch (error) {
      Swal.fire('Error!', 'Some error occurred. Try again later.', 'error');
    }
  };

  const addoffersubmit = async (e) => {
    try {
      e.preventDefault();
      if (new Date(expiryDate) < new Date()) {
        toast.error('Dtae should be upcoming days');
        return;
      }
      await addofferProduct(
        productId,
        name,
        expiryDate,
        discount,
        setIsOpen,
        toast,
        dispatch,
        logoutAdmin
      );
    } catch (error) {
      console.log(error);
    }
  };

  const Edithandle = (id) => {
    navigate(`/admin/product/${id}`);
  };

  const item = product.map((doc) => (
    <tr
      key={doc._id}
      className={`${doc.status !== 'unblock' ? 'bg-pink-200' : ''}`}
    >
      <td className="border border-gray-500 px-4 py-2">{doc.name}</td>
      <td className="border border-gray-500 px-4 py-2 w-48">
        <div className="grid grid-cols-2 gap-2">
          {doc.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product ${index + 1}`}
              className="w-10 h-10 object-cover rounded"
            />
          ))}
        </div>
      </td>
      <td className="border border-gray-500 px-4 py-2">{doc.language}</td>
      <td className="border border-gray-500 px-4 py-2">{doc.stock}</td>
      <td className="border border-gray-500 px-4 py-2">{doc.price}</td>
      <td className="border border-gray-500 px-4 py-2">{doc.sku}</td>
      <td className="border border-gray-500 px-4 py-2">
        {doc.categoryId.name}
      </td>
      <td className="border border-gray-500 px-4 py-2">
        <div className="flex justify-start space-x-4">
          <button
            onClick={() => Edithandle(doc._id)}
            className="border border-indigo-600 bg-indigo-500 text-white rounded-sm px-4 py-1 font-medium shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => Editblock(doc._id)}
            className="border border-indigo-600 bg-indigo-500 text-white rounded-sm px-4 py-1 font-medium shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all duration-200"
          >
            {doc.status === 'unblock' ? 'DELETE' : 'UNDO'}
          </button>
          <button
            onClick={() => Addoffer(doc._id)}
            className="border border-red-600 bg-red-500 text-white rounded-sm px-4 py-1 font-medium shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200"
          >
            Add offer
          </button>
        </div>
      </td>
    </tr>
  ));
  const Search = () => {
    const filtered = product.filter((doc) =>
      doc.name.toLowerCase().includes(prodname.toLowerCase())
    );

    const sorted = [
      ...filtered,
      ...product.filter(
        (doc) => !doc.name.toLowerCase().includes(prodname.toLowerCase())
      ),
    ];

    setProduct(sorted);
    setCurrentPage(1);
  };
  return (
    <div className="flex">
      <Toaster position="top-center" richColors />
      <div>
        <Sidebar />
      </div>
      <div className="bg-gray-200 min-h-screen min-w-full">
        <div className="flex-1 ml-64 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Product Management</h2>

            <div className="flex items-center gap-2">
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter name..."
                onChange={(e) => setProdname(e.target.value)}
              />
              <button
                onClick={Search}
                className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700 transition-all duration-200"
              >
                Search
              </button>
            </div>

            <button
              onClick={addProduct}
              className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700 transition-all duration-200"
            >
              ADD PRODUCT
            </button>
          </div>

          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-2">Product</th>
                <th className="border border-gray-300 px-2 py-2">Image</th>
                <th className="border border-gray-300 px-2 py-2">Language</th>
                <th className="border border-gray-300 px-2 py-2">Stock</th>
                <th className="border border-gray-300 px-2 py-2">Price</th>
                <th className="border border-gray-300 px-2 py-2">SKU</th>
                <th className="border border-gray-300 px-2 py-2">Category</th>
                <th className="border border-gray-300 px-2 py-2">Action</th>
              </tr>
            </thead>
            <tbody>{item}</tbody>
          </table>

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

              <form className="space-y-4" onSubmit={addoffersubmit}>
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

                <div className="grid grid-cols-2 gap-4">
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

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

export default GetProduct;
