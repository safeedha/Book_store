
import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import instance from '@/instance';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Payment() {
  return (
    <motion.div
      className='bg-gray-100 p-8 flex-1 min-h-screen bg-gray-300'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <div className='flex m-6'>
       <div className='border-4 border-indigo-600 mr-16 flex flex-col p-4 shadow-2xl shadow-inner shadow-gray-100'>
        <p>Payment method</p>
        <div>
          <input type='radio' name="payment"/>
          <label>Cash on Delivery</label>
          <p>Pay when You recive product</p>
        </div>
        <div>
          <input type='radio' name="payment"/>
          <label>Online Payment</label>
          <p>Pay securly with razorpay</p>
        </div>
       </div>
       <div className='flex-1 bg-red-100'>

       </div>
      </div>

    </motion.div>
  )
}

export default Payment