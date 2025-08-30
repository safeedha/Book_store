import React, { useEffect } from 'react';
import ProfileComponent from '@/Reusable/ProfileComponent';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  getSingleOrderdetail,
  getrelatedOrderdetail,
} from '../../User_apiservices/orderApi';
import { useState } from 'react';
import Navbar from '@/Reusable/Navbar';

function ProductDetails() {
  const { orderid, productid } = useParams();
  const [orderDetail, setOrderDetail] = useState({});
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const result = await getSingleOrderdetail(orderid, productid);
        setOrderDetail(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrderData();
  }, [orderid, productid]);

  useEffect(() => {
    const fetchrelatedOrderData = async () => {
      try {
        await getrelatedOrderdetail(orderid, productid, setRelated);
      } catch (error) {
        console.log(error);
      }
    };
    fetchrelatedOrderData();
  }, [orderid, productid]);

  const realtedorder = related.map((item, index) => (
    <div className="bg-white shadow-md p-5 rounded-lg" key={index}>
      <div className="flex items-center space-x-2">
        <img
          src={item.product_id.images[0]}
          className="w-16 h-16 object-cover rounded-lg shadow-md border border-gray-300"
        />
        <div className="text-xs leading-tight">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {item.product_id.name}
          </p>
          <p className="text-gray-600 mt-1">Qty: {item.quantity}</p>
          <p className="mt-1">
            <span className={`text-red-500 text-sm `}>
              &#8377;
              {Math.ceil(
                item.original_price -
                  (item.original_price * item.discount) / 100
              )}
            </span>
          </p>
          <p className="mt-1">
            <span className={`text-red-500 text-sm `}>
              Total: &#8377;
              {Math.ceil(
                item.original_price -
                  (item.original_price * item.discount) / 100
              ) * item.quantity}
            </span>
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-800 mt-4">
        <p>
          <strong>Order status:</strong>
          <span
            className={`px-2 py-0.5 rounded-full text-black text-xs  ${
              item.order_status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
          >
            {item.order_status}
          </span>
        </p>
      </div>
    </div>
  ));

  return (
    <div>
      <Navbar />
      <ProfileComponent />
      <motion.div
        className="bg-slate-50 ml-64 p-8 flex-1 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="bg-white rounded-xl shadow-lg p-4 max-w-4xl mx-auto my-8 h-auto max-h-[200px] mt-16">
          <div className="mb-1 text-gray-500 text-xs">{orderDetail.date}</div>

          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <img
                src={orderDetail.image}
                alt={orderDetail.productname}
                className="w-16 h-16 object-cover rounded-lg shadow-md border border-gray-300"
              />
              <div className="text-xs leading-tight">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {orderDetail.productname}
                </p>
                <p className="text-gray-600 mt-1">
                  Qty: {orderDetail.quantity}
                </p>
                <p className="mt-1">
                  <span className={`text-red-500 text-sm `}>
                    &#8377;
                    {Math.ceil(
                      orderDetail.originalprice -
                        (orderDetail.originalprice * orderDetail.discount) / 100
                    )}
                  </span>
                </p>

                <p className="text-red-500 text-sm">
                  Total: &#8377;
                  {Math.ceil(
                    orderDetail.originalprice -
                      (orderDetail.originalprice * orderDetail.discount) / 100
                  ) * orderDetail.quantity}
                </p>
              </div>
            </div>

            <div className="text-xs leading-tight flex-1 ml-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                Shipping Info
              </h3>
              <p>{orderDetail.shippingname}</p>
              <p>{orderDetail.shippingnumber}</p>
              <p>{orderDetail.shippingstreetAddress}</p>
              <p>
                {orderDetail.shippingcity}, {orderDetail.shippingdistrict},{' '}
                {orderDetail.shippingstate} - {orderDetail.shippingpincode}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-800">
              <p>
                <strong>Payment:</strong> {orderDetail.PaymentMethod}
              </p>
              <p
                className={`font-semibold ${
                  orderDetail.paymentStatus === 'unpaid'
                    ? 'text-red-500'
                    : 'text-green-500'
                }`}
              >
                <strong>Status:</strong> {orderDetail.paymentStatus}
              </p>
            </div>

            <div className="text-xs text-gray-800">
              <p>
                <strong>Order:</strong>
                <span
                  className={`px-2 py-0.5 rounded-full text-white text-xs ${
                    orderDetail.OrderStatus === 'Pending'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                >
                  {orderDetail.OrderStatus}
                </span>
              </p>
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <>
            <h1 className="text-center font-bold text-2xl mb-4">
              Other products in this order
            </h1>
            <div className="flex flex-wrap">{realtedorder}</div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default ProductDetails;
