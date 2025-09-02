import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { getOffer, deleteOffer } from './AdminApi/offerApi';
import Swal from 'sweetalert2';
import Pagination from '@/Reusable/Pagination';

function Offer() {
  const [offer, setOffer] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 3; 
  const [totalPage,setToatalPage]=useState(0)

  useEffect(() => {
    const allAvailableOffer = async () => {
      await getOffer(setOffer,page,itemsPerPage,setToatalPage); // Fetch all offers
    };
    allAvailableOffer();
  }, [page]);

  // Delete offer function
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this offer? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });
      if (result.isConfirmed) {
        await deleteOffer(id, setOffer); // Delete offer
      }
    } catch (error) {
      console.log(error);
    }
  };



  const offerItem = offer.map((doc, index) => (
    <tr key={index}>
      <td className="border border-gray-500 px-4 py-2">{doc.offerName}</td>
      <td className="border border-gray-500 px-4 py-2">{doc.offerType}</td>
      <td className="border border-gray-500 px-4 py-2">
        {doc.offerType_id.name}
      </td>
      <td className="border border-gray-500 px-4 py-2">{doc.offerAmount}</td>
      <td className="border border-gray-500 px-4 py-2">
        {new Date(doc.expiryDate).toISOString().split('T')[0]}
      </td>
      <td
        className={`border border-gray-500 px-4 py-2 ${new Date(doc.expiryDate) > new Date() ? 'text-green-500' : 'text-red-500'}`}
      >
        {new Date(doc.expiryDate) > new Date() ? 'Active' : 'Inactive'}
      </td>
      <td className="border border-gray-500 px-4 py-2">
        <button
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
          onClick={() => handleDelete(doc._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Toaster position="top-center" richColors />
        <Sidebar />
        <div className="flex-1 ml-64 p-6 overflow-y-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Offer Name</th>
                <th className="border border-gray-300 px-4 py-2">OfferType</th>
                <th className="border border-gray-300 px-4 py-2">Item name</th>
                <th className="border border-gray-300 px-4 py-2">
                  Offer amount in %
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Expired Time
                </th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>{offerItem}</tbody>
          </table>


          <Pagination
            currentPage={page}
            totalPages={totalPage} 
            onPageChange={setPage} 
          />
        </div>
      </div>
    </>
  );
}

export default Offer;
