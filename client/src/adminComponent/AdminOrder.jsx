import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { getOrder, OrderStatus } from './AdminApi/Order';
import Pagination from '@/Reusable/Pagination';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AdminOrder() {
  const [order, setOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 2; 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await getOrder();
      console.log(response.data.order);
      setOrder(response.data.order);
    };
    fetchOrder();
  }, []);

  const handleStatusChange = async (orderId, prodId, newStatus) => {
    console.log(orderId, prodId, newStatus)
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to change the order status to ${newStatus}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, cancel!',
    });
    if (result.isConfirmed) {
      const response = await OrderStatus(orderId,prodId, newStatus);
      setOrder(response.data.order);
    }
  };


  const singleOrderdetails = (itemId, prodId) => {
   
    if (!itemId || !prodId) {
      console.error("Invalid itemId or prodId");
      return;
    }
    navigate(`/admin/order-details/${itemId}/${prodId}`);
  };
  
 
  const totalPages = Math.ceil(order.length / rowsPerPage);
  const paginatedData = order.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const returnProduct=()=>{
    navigate("/admin/return")
  }

  const order_item = paginatedData.map((item, index) =>
    item.order_item.map((prod, index2) => {
      const currentStatus = prod.order_status;
      const paymentstatus=prod.payment_status
      return (
        <tr
          key={index2}
          className="bg-white border-b hover:bg-gray-100"
          onDoubleClick={() => singleOrderdetails(item._id, prod.product_id._id)}
        >
          <td className="px-4 py-2 text-center text-gray-700 border">
            {prod._id}
          </td>
          <td className="px-4 py-2 text-center text-gray-700 border">
            {item.shipping_address.name} {item.shipping_address.phone}{' '}
            {item.shipping_address.streetAddress} {item.shipping_address.state}{' '}
            {item.shipping_address.district} {item.shipping_address.city}{' '}
            {item.shipping_address.pincode}
          </td>
          <td className="px-4 py-2 text-center text-gray-700 border">
            {item.user_id.name}
          </td>
          <td className="px-4 py-2 text-center text-gray-700 border">
            {prod.product_id.name}({prod.quantity})
          </td>
         
          <td className="px-4 py-2 text-center text-gray-700 border">
            {item.payment_methods}
            ({paymentstatus})
          </td>
          
          <td className="px-4 py-2 text-center text-gray-700 border">
            {currentStatus}
          </td>
          <td>
            <select
              value={currentStatus}
              onChange={(e) =>
                handleStatusChange(item._id, prod.product_id._id, e.target.value)
              }
              className="px-3 py-2 border rounded"
            >
              <option value="Pending" >
                Pending
              </option>
              <option value="Processing" >
                Processing
              </option>
              <option value="Shipped" >
                Shipping
              </option>
              <option value="Delivered" >
                Delivered
              </option>
              <option value="Cancelled" >
                Cancelled
              </option>
              <option value="Returned" >
                Returned
              </option>
            </select>
          </td>
        </tr>
      );
    })
  );

  return (
    <>


      <Sidebar compact />
      <div className='bg-gray-200 min-h-screen min-w-full'>
      <div className="ml-24 lg:ml-48 p-4">
      
        <div className="overflow-hidden rounded-lg shadow-lg">
        <div className="flex justify-end mr-1">
          <button
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
            onClick={returnProduct}
          >
           Return requested Product
          </button>
        </div>

          <br></br>
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-slate-400 text-xs">
              <tr>
                <th className="px-4 py-2 border text-left">OrderID</th>
                <th className="px-4 py-2 border text-left">Shipping Address</th>
                <th className="px-4 py-2 border text-left">Customer</th>
                <th className="px-4 py-2 border text-left">Products</th>
                <th className="px-4 py-2 border text-left">Payment</th>

                <th className="px-4 py-2 border text-left">Status</th>
                <th className="px-4 py-2 border text-left">Action</th>
              </tr>
            </thead>
            <tbody>{order_item}</tbody>
          </table>
        </div>
       
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      </div>
    </>
  );
}

export default AdminOrder;
