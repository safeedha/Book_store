import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import {
  returnedProduct,
  approveProduct,
  rejectProduct,
} from './AdminApi/returnHandle';
import Swal from 'sweetalert2';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function Return() {
  const [returned, setReturned] = useState([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const getAllreturnProduct = async () => {
      await returnedProduct(setReturned);
    };
    getAllreturnProduct();
  }, []);

  const approvedHandle = async (orderid, productid, useId) => {
    const result = await Swal.fire({
      title: 'Are you sure about return this product?',
      text: `if you done know you cant never go back`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      setActive(true);
      console.log(orderid, productid);
      await approveProduct(orderid, productid, useId, toast, setActive);
    }
  };

  const rejectHandle = async (orderid, productid, useId) => {
    const result = await Swal.fire({
      title: 'Are you sure about reject return this product?',
      text: `if you done know you cant never go back`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      await rejectProduct(orderid, productid, useId, toast, setActive);
      setActive(true);
    }
  };

  const returnedItems = returned.map((item, index) => (
    <tr key={index}>
      <td className="border border-gray-300 px-4 py-2">
        <p className="">Name:{item.product_info.name}</p>
        <p>Qty:{item.filtered_items.quantity}</p>
        <p>
          Price for single:
          {item.filtered_items.original_price - item.filtered_items.discount}
        </p>
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {item.user_info.name}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {item.filtered_items.return_request.return_reason}
      </td>
      <th className="border border-gray-300 px-4 py-2">
        <div className="flex justify-center space-x-2">
          <button
            className={`font-bold py-1 px-3 rounded ${
              active
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' // Disabled styling
                : 'bg-green-500 hover:bg-green-600 text-white' // Enabled styling
            }`}
            disabled={active}
            onClick={() =>
              approvedHandle(
                item._id,
                item.filtered_items.product_id,
                item.user_id
              )
            }
          >
            APPROVED
          </button>

          <button
            className={`font-bold py-2 px-3 rounded ${
              active
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' // Disabled styling
                : 'bg-red-500 hover:bg-red-600 text-white' // Enabled styling
            }`}
            disabled={active}
            onClick={() =>
              rejectHandle(
                item._id,
                item.filtered_items.product_id,
                item.user_id
              )
            }
          >
            REJECTED
          </button>
        </div>
      </th>
    </tr>
  ));

  return (
    <>
      <Sidebar />
      <Toaster position="top-center" richColors />
      <div className="flex-1 ml-64 p-6 overflow-y-auto">
        {returned.length === 0 && (
          <div className="text-center text-red-500 text-lg mt-5">
            No return requested product
          </div>
        )}

        {returned.length > 0 && (
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">
                  Product Information
                </th>
                <th className="border border-gray-300 px-4 py-2">Customer</th>
                <th className="border border-gray-300 px-4 py-2">
                  Return Reason
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  <div className="flex justify-center space-x-2">Action</div>
                </th>
              </tr>
            </thead>

            <tbody>{returnedItems}</tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Return;
