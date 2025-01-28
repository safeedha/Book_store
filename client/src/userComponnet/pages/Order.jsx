import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProfileComponent from "@/Reusable/ProfileComponent";
import Footer from "@/Reusable/Footer";
import Navbar from "@/Reusable/Navbar";
import { useSelector } from "react-redux";
import { getOrder, cancelOrder, returnRequest } from "../../User_apiservices/orderApi";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { toast } from "sonner";
import UserPagination from "@/Reusable/UserPagination"; // Assuming you put the Pagination component in Reusable folder
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {useRazorpay} from "react-razorpay"
import {changePaymentStatus} from "../../User_apiservices/orderApi"

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function Order() {
  const user = useSelector((state) => state.user.userInfo);
  const [order, setOrder] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [productId, setProductId] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [status, setStatus] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 2;
  const {Razorpay} = useRazorpay();
  const navigate = useNavigate();
 const RAZORPAY_KEY_ID = "rzp_test_RmHsQLbeIzESnC"
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await getOrder();
        setOrder(response.data.original);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrderData();
  }, [status]);

const[csvData,setCsvData]=useState([])

const Retry = async (total,orderId) => {
  try {
   
    const response = await fetch("http://localhost:8000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: total * 100 }),
    });

    const order = await response.json();

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Book Loom",
      description: "Payment for your order",
      order_id: order.id,
      handler: async (response) => {
        try {
       
          const verifyResponse = await fetch("http://localhost:8000/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyResult = await verifyResponse.json();
          console.log("Verify Response Status:", verifyResponse.status);
          console.log("Verify Response Body:", verifyResult);

          if (verifyResult.message === "Payment verified successfully") {
             await changePaymentStatus("paid",orderId)
             setStatus((prev)=>!prev)
            alert("Payment successful!");
          } else {
            
            alert("Payment verification failed.");
          }
        } catch (err) {
          console.error("Error verifying payment:", err);
          alert("Payment verification failed: " + err.message);
        }
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

   
    const rzpay = new Razorpay(options);

   
    rzpay.on('payment.failed', async (response) => {
      try {

        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    });
    ;

    
    rzpay.open();
  } catch (err) {
    console.error("Error creating order:", err);
    alert("Error creating order: " + err.message);
  }
};

const exportToPDF = () => {
  const doc = new jsPDF();
  let currentY = 15;
  const lineHeight = 10;


  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 255);
  doc.text("BookLOOM", 14, currentY);

  // General Information
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  currentY += lineHeight;
  doc.text(`Order ID         :  ${csvData._id}`, 14, currentY);
  currentY += lineHeight;
  doc.text(`Ordered Date     :  ${new Date(csvData.createdAt).toISOString().split("T")[0]}`, 14, currentY)
  currentY += lineHeight;
  doc.text(`Payment Method   :  ${csvData.payment_methods}`, 14, currentY);

  // Line Separator
  currentY += lineHeight * 2;
  doc.setDrawColor(0, 0, 0);
  doc.line(10, currentY, 200, currentY);
  currentY += lineHeight * 2;

  // Shipping Address and Company Details in the Same Line
  doc.setFontSize(10); // Smaller font for details
  doc.setFont("helvetica", "italic");

  // Shipping Address
  let leftX = 14; // Left column starting point
  doc.text("Shipping Address:", leftX, currentY);
  currentY += lineHeight - 2;
  doc.text(`${csvData.shipping_address.name}`, leftX + 6, currentY);
  currentY += lineHeight - 2;
  doc.text(`${csvData.shipping_address.phone}`, leftX + 6, currentY);
  currentY += lineHeight - 2;
  doc.text(`${csvData.shipping_address.streetAddress}`, leftX + 6, currentY);
  currentY += lineHeight - 2;
  doc.text(
    `${csvData.shipping_address.state}, ${csvData.shipping_address.district}`,
    leftX + 6,
    currentY
  );
  currentY += lineHeight - 2;
  doc.text(
    `${csvData.shipping_address.city}, ${csvData.shipping_address.pincode}`,
    leftX + 6,
    currentY
  );

  // Company Details
  let rightX = 100; // Right column starting point
  currentY -= (lineHeight - 2) * 5; // Reset currentY to align with Shipping Address
  doc.text("Company Details:", rightX, currentY);
  currentY += lineHeight - 2;
  doc.text("BookLOOM", rightX + 6, currentY);
  currentY += lineHeight - 2;
  doc.text("Phone: 123-456-7890", rightX + 6, currentY);
  currentY += lineHeight - 2;
  doc.text("Email: support@bookloom.com", rightX + 6, currentY);
  currentY += lineHeight - 2;
  doc.text("Address: 123 Book Street,", rightX + 6, currentY);
  currentY += lineHeight - 2;
  doc.text("Cityville, BK 56789", rightX + 6, currentY);

  currentY += lineHeight; // Add spacing before the table

  // Table for Ordered Items
  const orderedItems = csvData.order_item.map((item, index) => ({
    "#": index + 1,
    "Product": item.product_id.name,
    "Status": item.order_status,
    "Quantity": item.quantity,
    "Original Price": item.discount === 0 
      ? item.original_price 
      : Math.ceil(item.original_price * item.discount / 100),
    "Total Price": item.discount === 0 
      ? item.original_price * item.quantity 
      : Math.ceil(item.original_price * item.discount / 100) * item.quantity,
  }));

  doc.autoTable({
    head: [["#", "Product", "Status", "Quantity", "Price", "Total Price"]],
    body: orderedItems.map(Object.values),
    startY: currentY,
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [0, 0, 255], textColor: [255, 255, 255] },
  });

  // Subtotal, Shipping, Discount, and Total
  const tableEndY = doc.lastAutoTable.finalY;
  currentY = tableEndY + lineHeight;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Subtotal         :  ${csvData.actual_amount}`, 170, currentY);
  currentY += lineHeight;
  doc.text(`Shipping         :  50`, 170, currentY);
  currentY += lineHeight;
  doc.text(`Discount         :  ${csvData.actual_amount - csvData.total_amount}`, 170, currentY);
  currentY += lineHeight;
  const totalAmount = csvData.total_amount === 0 ? 0 : csvData.total_amount + 50;
  doc.text(`Total              :  ${totalAmount}/-`, 170, currentY);


  currentY += lineHeight;



  doc.save("data.pdf");
};































  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = order.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(order.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const cancelHandle = async (orderId, productId) => {
    try {
      const response = await cancelOrder(orderId, productId);
      setOrder(response.data.original);
    } catch (error) {
      console.error(error);
    }
  };

  const viewHandle = (itemId, productId) => {
    navigate(`/order/${itemId}/product/${productId}`);
  };

  const submitReturnRequest = async (e) => {
    try {
      e.preventDefault();
      if (returnReason.length < 4) {
        toast.error("Reason should have 5 letters");
        return;
      }
      await returnRequest(returnReason, productId, orderId, toast, setOrder);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };





const orderDetail = currentOrders.map((item, index) => (
  <div key={index} className="rounded-xl bg-white shadow-lg p-6 mb-6">
    <div className="flex flex-col gap-3 bg-gray-50 p-4 rounded-md shadow-sm">
      <div className="flex justify-between items-center w-full">
        <div>
        <p className="text-gray-600 font-bold">
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </p>

          <p className="text-green-600 font-bold">
            Total amount to pay: &#8377;{item.total_amount > 0 ? item.total_amount + 50 : item.total_amount}
          </p>
          {item.total_amount > 0&&
          <p className="text-gray-600">
            Discounted amount: &#8377;{item.actual_amount - item.total_amount}
          </p>
          }
        </div>
        <div>
          <p className="font-semibold text-gray-700">{item.shipping_address.name}</p>
          <p className="text-sm text-gray-600">{item.shipping_address.phone}</p>
          <p className="text-sm">{item.shipping_address.streetAddress}</p>
          <p className="text-sm">
            {item.shipping_address.state}, {item.shipping_address.district}
          </p>
          <p className="text-sm">Pincode: {item.shipping_address.pincode}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCsvData(item);
              exportToPDF();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Invoice
          </button>
          {item.total_amount > 0 &&
            item.order_item?.some((prod) => prod.order_status === "Pending") &&
            item.order_item?.some((prod) => prod.payment_status === "failed" || prod.payment_status === "pending") && (
              <button
                onClick={() => Retry(item.total_amount + 50, item._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Retry Payment
              </button>
            )}
        </div>
      </div>
    </div>
    {item.order_item.map((prod, prodIndex) => (
      <div
        key={prodIndex}
        className="bg-white rounded-lg shadow-md p-4 mb-4 flex gap-6 relative h-auto"
      >
        <div className="flex-shrink-0">
          <img
            src={prod.product_id.images[0]}
            alt={prod.product_id.name}
            className="w-20 h-20 object-cover rounded"
          />
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold">{prod.product_id.name}</p>
          <p className="text-sm text-gray-600">Qty: {prod.quantity}</p>
          <p className="text-sm">
            <span className="text-red-500 font-semibold">
              &#8377;
              {prod.discount > 0
                ? Math.ceil(prod.original_price - (prod.original_price * prod.discount) / 100)
                : prod.original_price}
            </span>
          </p>
          <p className="text-sm">
            Total:
            <span className="text-red-500 font-semibold">
              &#8377;
              {Math.ceil(prod.original_price - (prod.original_price * prod.discount) / 100) * prod.quantity}
            </span>
          </p>
        </div>
        <div className="flex-1 text-right relative">
          <p
            className={`font-bold text-lg ${
              prod.order_status === "Delivered" ? "text-green-500" : "text-red-500"
            }`}
          >
            {prod.order_status}
          </p>
          {prod.order_status !== "Delivered" &&
            prod.order_status !== "Cancelled" &&
            prod.order_status !== "Returned" && (
              <button
                onClick={() => cancelHandle(item._id, prod.product_id._id)}
                className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
              >
                Cancel the Order
              </button>
            )}
          {prod.order_status === "Delivered" &&
            !prod.return_request?.is_requested && !prod.return_request?.return_reason &&(
              <button
                className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
                onClick={() => {
                  setProductId(prod.product_id._id);
                  setOrderId(item._id);
                  setIsOpen(true);
                }}
              >
                Return
              </button>
            )}
             {prod.return_request.is_requested && (
              <button className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition">
                Requested
              </button>
            )}
            {prod.return_request.is_requested === false && prod.return_request.is_approved === false && (
              <button className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition">
                Your return request was rejected
              </button>
            )}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setIsOpen(false)}
              style={customStyles}
              contentLabel="Return Request Modal"
            >
              <button onClick={() => setIsOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
                  <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                </svg>
              </button>
              <form onSubmit={submitReturnRequest}>
                <label className="block mb-2 text-sm font-medium text-gray-700">Return Reason</label>
                <textarea
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  rows="3"
                  placeholder="Enter your reason for return"
                  onChange={(e) => setReturnReason(e.target.value)}
                  required
                ></textarea>
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition" type="submit">
                  Submit
                </button>
              </form>
            </Modal>




          <p
            className="text-sm text-gray-500 mt-4 cursor-pointer hover:underline"
            onClick={() => viewHandle(item._id, prod._id)}
          >
            View item
          </p>
        </div>
      </div>
    ))}
  </div>
));

  return (
    <>
      <Navbar user={user ? user.name : null} />
      <div className="flex">
        <ProfileComponent />
        <motion.div className="bg-white ml-64 p-8 flex-1 min-h-screen pt-32" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <div className="m-4">{orderDetail}</div>
          <UserPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
