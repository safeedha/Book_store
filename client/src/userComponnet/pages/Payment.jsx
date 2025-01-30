// import React, { useState } from 'react';
// import { motion } from 'framer-motion';

// function Payment() {
//   const [paymentMethod, setPaymentMethod] = useState('');

//   const handlePaymentChange = (e) => {
//     setPaymentMethod(e.target.value);
//   };

//   return (
//     <motion.div
//       className="bg-gray-100 p-8 flex-1 min-h-screen"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 2 }}
//     >
//       <div className="flex m-6">
//         <div className="border-4 border-indigo-600 mr-16 flex flex-col p-4 shadow-2xl shadow-inner shadow-gray-100">
//           <p className="font-semibold text-lg mb-2">Payment Method</p>

//           <div className="mb-4">
//             <input
//               type="radio"
//               id="cash"
//               name="payment"
//               value="cash"
//               checked={paymentMethod === 'cash'}
//               onChange={handlePaymentChange}
//               className="mr-2"
//             />
//             <label htmlFor="cash" className="cursor-pointer font-medium">
//               Cash on Delivery
//             </label>
//             <p className="text-sm text-gray-600">Pay when you receive the product</p>
//           </div>

//           <div>
//             <input
//               type="radio"
//               id="online"
//               name="payment"
//               value="online"
//               checked={paymentMethod === 'online'}
//               onChange={handlePaymentChange}
//               className="mr-2"
//             />
//             <label htmlFor="online" className="cursor-pointer font-medium">
//               Online Payment
//             </label>
//             <p className="text-sm text-gray-600">Pay securely with Razorpay</p>
//           </div>
//         </div>

//         <div className="flex-1 bg-red-100">{/* Add payment details or summary here */}</div>
//       </div>
//     </motion.div>
//   );
// }

// export default Payment;

import React from 'react'

function Payment() {
  return (
    <div>Payment</div>
  )
}

export default Payment
