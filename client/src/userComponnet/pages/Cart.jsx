import React ,{useEffect, useState} from 'react'
import { motion } from 'framer-motion'
import ProfileComponent from '@/Reusable/ProfileComponent'
import { useNavigate} from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Navbar from '@/Reusable/Navbar';
import {logoutUser} from '../../feature/userSlice'
import { useDispatch ,useSelector} from 'react-redux'
import { fetchCart,deleteCart,addCartQuantity,subCartQuantity} from '@/User_apiservices/cart'
import Swal from 'sweetalert2';
import { current } from '@reduxjs/toolkit';

function Cart() {
  const [cartproduct,setCartproduct]=useState([])
  const [price,setPrice]=useState(null)
  const Navigate =useNavigate()
  const dispatch=useDispatch() 
  const user=useSelector((state)=>state.user.userInfo)
  const [del,setDel]=useState(false)

  useEffect(() => {
    const fetchCartProduct = async () => {
      try {    
        await fetchCart(setCartproduct,dispatch,logoutUser,Navigate,toast);
      } catch (error) {
        console.error('Error fetching cart products:', error);
      }
    };
  
    fetchCartProduct();
  }, []); 
  
  


  useEffect(() => {
    const result = cartproduct.reduce((accumulator, current) => {
      const isOfferValid = new Date(current.product_id.offerId?.expiryDate) > new Date();
      const price = isOfferValid 
        ? Math.ceil(current.product_id.price - (current.product_id.price * current.product_id.offerId.offerAmount / 100))
        : current.product_id.price;
      const totalProductPrice =( price * current.quantity)
      return accumulator + totalProductPrice;
    }, 0);
  setPrice(result)
  }, [cartproduct]);
  
 const deletHandle = async (id) => {
  try {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
    console.log(result)
    if (result.isConfirmed) {
      await deleteCart(id,setCartproduct,Swal)
      
    }
  } catch (error) {
    console.log(error)
  }
};


 const plceOrderHandle=()=>{
  Navigate('/checkout')
 }

 
 const addQuantity = async (id1, productid) => {
   try{
     await addCartQuantity(id1, productid,setCartproduct,toast,logoutUser,dispatch)
   }
   catch(error)
   {
    console.log(error)
   }
};












 const subQuantity=async(id1,productid)=>{
  try{
    await subCartQuantity(id1,productid,setCartproduct, dispatch,logoutUser,toast)
  }
  catch(error)
  {
    console.log(error)
  }
 }







const cartItem = cartproduct.map((item, index) => (
  <div
    key={item._id}
    className="border-solid border-2 border-orange-900 pl-3 flex mb-3 py-2 w-[400px] shadow-lg"
  >
    <div>
      <img
        src={item.product_id.images[1]}
        className="w-16 h-16 object-cover"
        alt={item.product_id.name}
      />
    </div>

    <div className="pl-3">
      <p className="text-neutral-950 underline font-semibold">
        {item.product_id.name}
      </p>
    
      <div className="flex items-center">
      <p className={`text-red-700 font-medium ${new Date(item.product_id.offerId?.expiryDate)>new Date() ? "line-through" : ""} mr-2`}>
      &#8377;{item.product_id.price}
        </p>

       
        {item.product_id.offerId && new Date(item.product_id.offerId?.expiryDate)>new Date()&&(
          <>
            <p className="text-green-700 font-medium">
            &#8377;{Math.ceil(item.product_id.price - (item.product_id.offerId.offerAmount * item.product_id.price / 100))}&nbsp;&nbsp;
            </p>
            <p className="text-green-600 ">
              {item.product_id.offerId.offerAmount}% offer
            </p>
          </>
        )}


      </div>

      <div className="mt-2 flex items-center">
        <button
          className="border border-gray-500 rounded px-2 py-1 active:bg-violet-700"
          onClick={() => addQuantity(item._id, item.product_id._id)}
        >
          +
        </button>
        <span className="mx-2 font-medium">{item.quantity}</span>
        <button
          className="border border-gray-500 rounded px-2 py-1 active:bg-violet-700"
          onClick={() => subQuantity(item._id, item.product_id._id)}
        >
          -
        </button>
      </div>
    </div>

    <div className="ml-auto px-4 flex flex-col items-end">
    {((item.product_id.offerId === null) || 
        (item.product_id.offerId && new Date(item.product_id.offerId?.expiryDate) < new Date())) && (
        <p className="text-red-700 font-medium mb-2">
           &#8377;{item.product_id.price * item.quantity}
        </p>
      )}




       {item.product_id.offerId  &&new Date(item.product_id.offerId?.expiryDate)>new Date()&& (
        <p className="text-red-700 font-medium mb-2">
           &#8377;{Math.ceil((item.product_id.price - (item.product_id.offerId.offerAmount * item.product_id.price / 100)) * item.quantity)}       
        </p>
      )}

      
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="30"
        height="30"
        viewBox="0 0 100 100"
        onClick={() => deletHandle(item._id)}
      >
        <path
          fill="#f37e98"
          d="M25,30l3.645,47.383C28.845,79.988,31.017,82,33.63,82h32.74c2.613,0,4.785-2.012,4.985-4.617L75,30"
        ></path>
        <path
          fill="#f15b6c"
          d="M65 38v35c0 1.65-1.35 3-3 3s-3-1.35-3-3V38c0-1.65 1.35-3 3-3S65 36.35 65 38zM53 38v35c0 1.65-1.35 3-3 3s-3-1.35-3-3V38c0-1.65 1.35-3 3-3S53 36.35 53 38zM41 38v35c0 1.65-1.35 3-3 3s-3-1.35-3-3V38c0-1.65 1.35-3 3-3S41 36.35 41 38zM77 24h-4l-1.835-3.058C70.442 19.737 69.14 19 67.735 19h-35.47c-1.405 0-2.707.737-3.43 1.942L27 24h-4c-1.657 0-3 1.343-3 3s1.343 3 3 3h54c1.657 0 3-1.343 3-3S78.657 24 77 24z"
        ></path>
        <path
          fill="#1f212b"
          d="M66.37 83H33.63c-3.116 0-5.744-2.434-5.982-5.54l-3.645-47.383 1.994-.154 3.645 47.384C29.801 79.378 31.553 81 33.63 81H66.37c2.077 0 3.829-1.622 3.988-3.692l3.645-47.385 1.994.154-3.645 47.384C72.113 80.566 69.485 83 66.37 83zM56 20c-.552 0-1-.447-1-1v-3c0-.552-.449-1-1-1h-8c-.551 0-1 .448-1 1v3c0 .553-.448 1-1 1s-1-.447-1-1v-3c0-1.654 1.346-3 3-3h8c1.654 0 3 1.346 3 3v3C57 19.553 56.552 20 56 20z"
        ></path>
      </svg>
    </div>
  </div>
));


  return (
    <>
    <Navbar user={user ? user.name : null} />
    <div className='flex'>
      <ProfileComponent />
      <motion.div
        className='bg-white  ml-64 p-8 flex-1 min-h-screen pt-32' 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1}}
        
      >
  
        {cartproduct.length === 0 && (
          <div className="rounded-xl flex flex-col items-center justify-center bg-blue-50 shadow-2xl mb-4 px-6 py-8 h-64 text-center">
           
            <p className="text-lg font-semibold text-gray-700">Your cart is empty!</p>
            <p className="text-gray-500 mb-4">
              Looks like you haven’t added anything to your cart yet.
            </p>
            <button
              onClick={() => Navigate('/product')}
              className="mt-4 bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-emerald-700 transition duration-200"
            >
              Start Shopping
            </button>
          </div>
        )}

        <Toaster position="top-center" richColors />
        <div className='flex '>
        <div className='mr-10'>
        {cartItem}
        </div>
        {cartproduct.length > 0 && price > 0 &&
         <div className="border-double border-4 border-gray-300 rounded-lg p-6 bg-white max-w-sm shadow-lg">
         <p className="text-emerald-700 underline font-semibold text-lg mb-4 text-center">
           Order Summary
         </p>
         <div className="text-gray-700 space-y-2">
           <div className="flex justify-between">
             <span>Subtotal:</span>
             <span className="font-medium">{price}</span>
           </div>
           <div className="flex justify-between">
             <span>Shipping charge:</span>
             <span className="font-medium text-green-600">50</span>
           </div>
           <hr className="my-2 border-t-2 border-gray-300" />
           <div className="flex justify-between text-lg font-semibold">
             <span>Total:</span>
             <span> &#8377;{price}</span>
           </div>
         </div>
         <button className="mt-6 w-full bg-emerald-700 text-white py-2 rounded-lg font-medium hover:bg-emerald-800 transition duration-200" onClick={plceOrderHandle}>
           Place Order
         </button>
       </div>       
  
        }
         </div>
        
       
        
      </motion.div>
    </div>
    </>
  )
}

export default Cart