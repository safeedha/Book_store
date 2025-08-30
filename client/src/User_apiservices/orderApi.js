import instance from './instance';
import Swal from 'sweetalert2';

export const createOrder = async (
  price,
  address_id,
  payment_methods,
  coupenId,
  actalprice,
  toast,
  Navigate,
  dispatch,
  logoutUser,
  setOrderId
) => {
  try {
    const response = await instance.post('user/order', {
      price,
      address_id,
      payment_methods,
      coupenId,
      actalprice,
    });
    if (response.status === 201) {
      toast.success('Order created successfully');
      setOrderId(response.data.orderId);
      if (
        payment_methods === 'cash on delivery' ||
        payment_methods === 'wallet payment'
      ) {
        setTimeout(() => {
          Navigate('/order-confirm', { state: { fromCheckout: true } });
        }, 2000);
      }
    }
  } catch (error) {
    if (error.response?.status === 400) {
      console.log(error);
      toast.error(error.response.data.message);
      setTimeout(() => {
        Navigate('/cart');
      }, 2000);
      return;
    }
    if (error.response?.data.message === 'User blocked') {
      console.log(error);
      toast.error('Youra accountt is blocked You cant know order product');
      setTimeout(() => {
        dispatch(logoutUser());
      }, 2000);
      return;
    }
  }
};

export const getOrder = async () => {
  try {
    console.log('fetching');
    const response = await instance.get('user/order');
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const cancelOrder = async (orderid, productId) => {
  try {
    const response = await instance.patch(`user/order/${orderid}`, {
      productId,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getSingleOrderdetail = async (orderid, productId) => {
  try {
    const response = await instance.get(
      `user/orders/${orderid}/product/${productId}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

export const getrelatedOrderdetail = async (orderid, productid, setRelated) => {
  try {
    const response = await instance.get(`user/orders/${orderid}/${productid}`);
    console.log(response.data.related);
    setRelated(response.data.related);
  } catch (error) {
    console.log(error);
  }
};

export const returnRequest = async (
  returnreason,
  productId,
  orderId,
  toast,
  setOrder
) => {
  try {
    console.log(returnreason);
    console.log(productId, orderId);
    const response = await instance.post(
      `user/return/${orderId}/product/${productId}`,
      { returnreason }
    );
    if (response) {
      toast.success('You requested for return');
      setOrder(response.data.order);
    }
  } catch (error) {
    console.log(error);
  }
};

export const changePaymentStatus = async (status, orderId) => {
  try {
    const response = await instance.patch('user/payment/', { status, orderId });
  } catch (error) {
    console.log('Error changing payment status:', error);
  }
};

export const handlePayment = async (Razorpay, totalprice, orderId) => {
  try {
    const RAZORPAY_KEY_ID = 'rzp_test_RmHsQLbeIzESnC';

    // Step 1: Create an order on the backend using axios
    const response = await instance.post('create-order', {
      amount: totalprice * 100,
    });

    const order = response.data;

    // Step 2: Configure Razorpay options
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Book Loom',
      description: 'Payment for your order',
      order_id: order.id,
      handler: async (response) => {
        try {
          // Step 3: Verify the payment on the backend using axios
          const verifyResponse = await instance.post('verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          const verifyResult = verifyResponse.data;
          console.log('Verify Response Status:', verifyResponse.status);
          console.log('Verify Response Body:', verifyResult);

          if (verifyResult.message === 'Payment verified successfully') {
            await changePaymentStatus('paid', orderId);
            alert('Payment successful!');
          } else {
            alert('Payment verification failed.');
          }
        } catch (err) {
          console.error('Error verifying payment:', err);
          alert('Payment verification failed: ' + err.message);
        }
      },
      prefill: {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#3399cc',
      },
    };

    // Step 3: Instantiate Razorpay
    const rzpay = new Razorpay(options);

    // Step 4: Handle payment failure
    rzpay.on('payment.failed', async (response) => {
      try {
        await changePaymentStatus('failed', orderId);
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    });

    rzpay.open();
  } catch (err) {
    console.error('Error creating order:', err);
    alert('Error creating order: ' + err.message);
  }
};

// export const handlePayment = async (Razorpay,totalprice,orderId) => {
//   try {
//     const RAZORPAY_KEY_ID = "rzp_test_RmHsQLbeIzESnC";

//     // Step 1: Create an order on the backend
//     const response = await fetch("http://localhost:8000/create-order", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ amount: totalprice *100}),
//     });

//     const order = await response.json();

//     // Step 2: Configure Razorpay options
//     const options = {
//       key: RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: order.currency,
//       name: "Book Loom",
//       description: "Payment for your order",
//       order_id: order.id,
//       handler: async (response) => {
//         try {
//           // Step 3: Verify the payment on the backend
//           const verifyResponse = await fetch("http://localhost:8000/verify-payment", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             }),
//           });

//           const verifyResult = await verifyResponse.json();
//           console.log("Verify Response Status:", verifyResponse.status);
//           console.log("Verify Response Body:", verifyResult);

//           if (verifyResult.message === "Payment verified successfully") {
//             await changePaymentStatus("paid",orderId)
//             alert("Payment successful!");
//           } else {

//             alert("Payment verification failed.");
//           }
//         } catch (err) {
//           console.error("Error verifying payment:", err);
//           alert("Payment verification failed: " + err.message);
//         }
//       },
//       prefill: {
//         name: "John Doe",
//         email: "john@example.com",
//         contact: "9999999999",
//       },
//       notes: {
//         address: "Razorpay Corporate Office",
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     // Step 3: Instantiate Razorpay
//     const rzpay = new Razorpay(options);

//     // Step 4: Handle payment failure
//     rzpay.on('payment.failed', async (response) => {
//       try {
//         await changePaymentStatus("failed", orderId);
//         console.error("Payment failed:", response.error);
//         alert(`Payment failed: ${response.error.description}`);
//       } catch (error) {
//         console.error("Error updating payment status:", error);
//       }
//     });
//     ;

//     rzpay.open();
//   } catch (err) {
//     console.error("Error creating order:", err);
//     alert("Error creating order: " + err.message);
//   }
// };

// export const handlePayment = async (
//   price,
//   Razorpay,
//   selectedAddress,
//   coupenId,
//   pp,
//   toast,
//   Navigate,
//   dispatch,
//   logoutUser
// ) => {
//   try {

//     const paymentMethod = "online payment";
//     const RAZORPAY_KEY_ID = "rzp_test_RmHsQLbeIzESnC";
//     const amount = price * 100;

//     const response = await fetch("http://localhost:8000/create-order", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ amount: amount }),
//     });

//     const order = await response.json();

//     const options = {
//       key: RAZORPAY_KEY_ID,
//       amount: order.amount,
//       currency: order.currency,
//       name: "Book Loom",
//       description: "Payment for your order",
//       order_id: order.id,
//       handler: async (response) => {
//         try {
//           await fetch("http://localhost:8000/verify-payment", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             }),
//           });

//           await createOrder(
//             price,
//             selectedAddress,
//             paymentMethod,
//             coupenId,
//             pp,
//             toast,
//             Navigate,
//             dispatch,
//             logoutUser
//           );

//           Swal.fire({
//             title: "Payment success!",
//             text: "Your order is placed!",
//             icon: "success",
//           });
//         } catch (orderError) {
//           console.error("Order creation failed:", orderError);
//           toast.error("Order creation failed. Please try again.");
//         }
//       },
//       prefill: {
//         name: "John",
//         email: "john@example.com",
//         contact: "9999999999",
//       },
//       notes: {
//         address: "Razorpay Corporate Office",
//       },
//       theme: {
//         color: "#3399cc",
//       },
//     };

//     const rzpay = new Razorpay(options);

//     let paymentFailedHandled = false;
//     let flag=true

//     rzpay.on("payment.failed", (response) => {
//       if (paymentFailedHandled) return;
//       paymentFailedHandled = true;
//       flag=false
//       if(flag===false)
//       {
//         return
//       }
//       console.log("Navigating to home");
//       alert("Payment failed. Please try again later.");
//       rzpay.close();
//       console.log("Navigating to home");
//       setTimeout(() => {
//         Navigate("/"); // Redirect after ensuring modal closes
//       }, 500); // Add a slight delay for smooth navigation
//     });

//     if(flag===false)
//     {
//       console.log(flag)
//       return
//     }
//     rzpay.open();
//   } catch (err) {
//     console.error("Error creating order:", err);
//     alert("Error creating order: " + err.message);
//   }
// };
