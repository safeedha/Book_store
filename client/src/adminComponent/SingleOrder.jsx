import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useParams } from 'react-router-dom';
import { getSingleOrderdetail } from './AdminApi/Order';

function SingleOrder() {
  const { itemId, prodId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSingleOrderDetail = async () => {
      try {
        const data = await getSingleOrderdetail(itemId, prodId);
        setOrderDetail(data.data.order);
      } catch (err) {
        setError('Error fetching single order details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleOrderDetail();
  }, [itemId, prodId]);

  useEffect(() => {
    console.log(orderDetail);
  }, [orderDetail]);

  if (loading) {
    return <div className="text-center text-lg">Loading order details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-52 bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto my-6">
        <div className="mb-2 text-gray-500 text-sm">
          {orderDetail?.date || 'Date not available'}
        </div>

        <div className="flex flex-wrap justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={orderDetail?.image || 'https://via.placeholder.com/150'}
              alt={orderDetail?.productname || 'Product'}
              className="w-28 h-28 object-cover rounded-lg shadow-md border border-gray-300"
            />
            <div>
              <p className="text-xl font-semibold text-gray-800">
                {orderDetail?.productname || 'Product Name'}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Quantity: {orderDetail?.quantity || 0}
              </p>
              <p className="text-sm font-semibold mt-1">
                Price for single unit:{' '}
                <span className="text-red-500">
                  ${orderDetail?.TotalPrice || 0}
                </span>
              </p>
            </div>
          </div>

          <div className="ml-8 flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Shipping Information
            </h3>
            <p className="text-gray-800 text-sm">
              {orderDetail?.shippingname || 'N/A'}
            </p>
            <p className="text-gray-800 text-sm">
              {orderDetail?.shippingnumber || 'N/A'}
            </p>
            <p className="text-gray-800 text-sm">
              {orderDetail?.shippingstreetAddress || 'N/A'}
            </p>
            <p className="text-gray-800 text-sm">
              {orderDetail?.shippingcity || 'City'},{' '}
              {orderDetail?.shippingdistrict || 'District'},{' '}
              {orderDetail?.shippingstate || 'State'} -{' '}
              {orderDetail?.shippingpincode || 'Pincode'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex flex-col text-gray-800 text-sm">
            <p>
              <strong>Payment Method:</strong>{' '}
              {orderDetail?.PaymentMethod || 'N/A'}
            </p>
            <p
              className={`text-sm font-semibold ${
                orderDetail?.paymentStatus === 'unpaid'
                  ? 'text-red-500'
                  : 'text-green-500'
              }`}
            >
              <strong>Payment Status:</strong>{' '}
              {orderDetail?.paymentStatus || 'N/A'}
            </p>
          </div>

          <div className="flex flex-col text-gray-800 text-sm">
            <p>
              <strong>Status:</strong>
              <span
                className={`px-2 py-0.5 rounded-full text-white ${
                  orderDetail?.OrderStatus === 'Pending'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              >
                {orderDetail?.OrderStatus || 'N/A'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* <div className="flex-1 ml-52 bg-white rounded-lg shadow-md p-4 max-w-md mx-auto my-6">
  <div className="mb-3 text-gray-500 text-sm">
    {orderDetail?.date || 'Date not available'}
  </div>

  <div className="flex flex-wrap justify-between items-start mb-6">
    <div className="flex items-center space-x-4">
      <img
        src={orderDetail?.image || 'https://via.placeholder.com/150'}
        alt={orderDetail?.productname || 'Product'}
        className="w-20 h-20 object-cover rounded-md shadow-sm border border-gray-300"
      />
      <div>
        <p className="text-lg font-semibold text-gray-800">
          {orderDetail?.productname || 'Product Name'}
        </p>
        <p className="text-gray-600 text-sm mt-1">
          Quantity: {orderDetail?.quantity || 0}
        </p>
        <p className="text-sm font-semibold mt-1">
          Price for single unit: <span className="text-red-500">${orderDetail?.TotalPrice || 0}</span>
        </p>
      </div>
    </div>

    <div className="ml-8 flex-1">
      <h3 className="text-base font-semibold text-gray-800 mb-2">
        Shipping Information
      </h3>
      <p className="text-gray-800 text-sm">{orderDetail?.shippingname || 'N/A'}</p>
      <p className="text-gray-800 text-sm">{orderDetail?.shippingnumber || 'N/A'}</p>
      <p className="text-gray-800 text-sm">{orderDetail?.shippingstreetAddress || 'N/A'}</p>
      <p className="text-gray-800 text-sm">
        {orderDetail?.shippingcity || 'City'}, {orderDetail?.shippingdistrict || 'District'},{' '}
        {orderDetail?.shippingstate || 'State'} - {orderDetail?.shippingpincode || 'Pincode'}
      </p>
    </div>
  </div>

  <div className="flex flex-wrap justify-between items-center mb-4">
    <div className="flex flex-col text-gray-800 text-sm">
      <p>
        <strong>Payment Method:</strong> {orderDetail?.PaymentMethod || 'N/A'}
      </p>
      <p
        className={`text-sm font-semibold ${
          orderDetail?.paymentStatus === 'unpaid' ? 'text-red-500' : 'text-green-500'
        }`}
      >
        <strong>Payment Status:</strong> {orderDetail?.paymentStatus || 'N/A'}
      </p>
    </div>

    <div className="flex flex-col text-gray-800 text-sm">
      <p>
        <strong>Status:</strong>
        <span
          className={`px-2 py-0.5 rounded-full text-white text-xs ${
            orderDetail?.OrderStatus === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'
          }`}
        >
          {orderDetail?.OrderStatus || 'N/A'}
        </span>
      </p>
    </div>
  </div>
</div> */}

      {/* <div className="flex-1 ml-52 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto my-8">
        <div className="mb-4 text-gray-500 text-lg">
          {orderDetail?.date || 'Date not available'}
        </div>

    
        <div className="flex flex-wrap justify-between items-start mb-8">
        
          <div className="flex items-center space-x-6">
            <img
              src={orderDetail?.image || 'https://via.placeholder.com/150'}
              alt={orderDetail?.productname || 'Product'}
              className="w-32 h-32 object-cover rounded-lg shadow-md border-2 border-gray-300"
            />
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {orderDetail?.productname || 'Product Name'}
              </p>
              <p className="text-gray-600 mt-2">
                Quantity: {orderDetail?.quantity || 0}
              </p>
              <p className="text-lg font-semibold mt-2">
                 Price for single unit: <span className="text-red-500">${orderDetail?.TotalPrice || 0}</span>
              </p>
            </div>
          </div>

         
          <div className="ml-16 flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Shipping Information
            </h3>
            <p className="text-gray-800">{orderDetail?.shippingname || 'N/A'}</p>
            <p className="text-gray-800">{orderDetail?.shippingnumber || 'N/A'}</p>
            <p className="text-gray-800">{orderDetail?.shippingstreetAddress || 'N/A'}</p>
            <p className="text-gray-800">
              {orderDetail?.shippingcity || 'City'}, {orderDetail?.shippingdistrict || 'District'},{' '}
              {orderDetail?.shippingstate || 'State'} - {orderDetail?.shippingpincode || 'Pincode'}
            </p>
          </div>
        </div>

      
        <div className="flex flex-wrap justify-between items-center mb-8">
    
          <div className="flex flex-col text-gray-800">
            <p><strong>Payment Method:</strong> {orderDetail?.PaymentMethod || 'N/A'}</p>
            <p
              className={`text-lg font-semibold ${
                orderDetail?.paymentStatus === 'unpaid' ? 'text-red-500' : 'text-green-500'
              }`}
            >
              <strong>Payment Status:</strong> {orderDetail?.paymentStatus || 'N/A'}
            </p>
          </div>

     
          <div className="flex flex-col text-gray-800">
            <p>
              <strong>Status:</strong>
              <span
                className={`px-3 py-1 rounded-full text-white ${
                  orderDetail?.OrderStatus === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'
                }`}
              >
                {orderDetail?.OrderStatus || 'N/A'}
              </span>
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default SingleOrder;
