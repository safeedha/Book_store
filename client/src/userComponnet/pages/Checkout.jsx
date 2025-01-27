import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/Reusable/Navbar';
import Footer from '@/Reusable/Footer';
import {createOrder} from '../../User_apiservices/orderApi'
import {logoutUser} from '../../feature/userSlice'
import { useDispatch } from 'react-redux';
import { addAddress, getAddress,deletAddress} from '@/User_apiservices/Address';
import { fetchCart } from '@/User_apiservices/cart';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import {handlePayment} from '../../User_apiservices/orderApi'
import {useRazorpay} from "react-razorpay"
import {getAvailableCoupen,coupenStatus} from '../../User_apiservices/coupen'
import { getWalletinformation } from '@/User_apiservices/wallet';

function Checkout() {
  const [addr,setAddr]=useState(false)
  const [address, setAddress] = useState([]);
  const Navigate = useNavigate();
  const dispatch=useDispatch()
  const [add, setAdd] = useState(false);
  const [mod,setMod]=useState(false)
  const user=useSelector((state)=>state.user.userInfo)
   const {Razorpay} = useRazorpay()
   const [coupen,setCoupen]=useState([])
   const [coupenId,setCopenId]=useState("")
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [payment, setPayment] = useState(false);
  const [cartproduct,setCartproduct]=useState([])
  const [price,setPrice]=useState(null)
  const [paymentMethod, setPaymentMethod] = useState('');
  const [coupenCode,setCoupencode]=useState("")
  const [totalprice,setTotalprice]=useState(null)
  const [discount,setDiscount]=useState(0)
  const [orderId,setOrderId]=useState("")
  const [dis,setDis]=useState(false)
  const [wallet,setWallet]=useState([])
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    streetAddress: '',
    state: '',
    district: '',
    pincode: '',
    city: '',
  });
     
  useEffect(()=>{
    if(wallet.length>0)
      {
        const sum = wallet.reduce((accumulator, current) => {
          if (current.transactionType === 'credit') {
            return accumulator + current.amount; 
          }
          if (current.transactionType === 'debit') {
            return accumulator - current.amount; 
          }
          return accumulator; 
        }, 0);
        console.log(sum)
         if(sum<totalprice)
         {
          toast.error("There is no available balance in Your wallet")
         }
         else if(sum>=totalprice)
         {
          setPayment(true)
         }
      }

  },[wallet])

 const addressManagement=()=>{
  setAddr(true)
 }
  const handleAddressChange = (id) => {
    console.log(id);
    setSelectedAddress(id);
    setTimeout(()=>{
      setAddr(false)
    },1000)
    
  };
     
  const paymentHandle = async(e) => { 
    console.log(e.target.value)
    setPaymentMethod(e.target.value);
    if(e.target.value==="cash on delivery")
    {
      setPayment(true)
    }
    else if(e.target.value==="wallet payment")
    {
      await getWalletinformation(setWallet)
      if(wallet.length>0)
      {
        alert("wallet payment")
        const sum = wallet.reduce((accumulator, current) => {
          if (current.transactionType === 'credit') {
            return accumulator + current.amount; 
          }
          if (current.transactionType === 'debit') {
            return accumulator - current.amount; 
          }
          return accumulator; 
        }, 0);
        console.log(sum)
         if(sum<totalprice)
         {
          toast.error("There is no available balance in Your wallet")
         }
         else if(sum>=totalprice)
         {
          setPayment(true)
         }
      } 
      
    }
    else{
      setPayment(true)
  //     let  tot=totalprice-50
  //    // await createOrder(tot,selectedAddress,coupenId,price,toast,Navigate,dispatch,logoutUser)
  //  //  await handlePayment(tot,Razorpay, selectedAddress,coupenId,price,toast,Navigate,dispatch,logoutUser)
    //  await handlePayment(Razorpay)
  }  
  };
  
 
    useEffect(()=>{
     if(totalprice>1000)
     {
      setDis(true)
     }
     else
     {
      setDis(false)
     }
    },[totalprice])


  useEffect(() => {
    const fetchAddress = async () => {
      try {
        await getAddress( setAddress)
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddress();
  }, []);

  useEffect(()=>{
    const fetchCartProduct=async()=>{
      try{
        await fetchCart(setCartproduct,dispatch,logoutUser,Navigate,toast)   
      }
      catch(error)
      {
       console.log(error)
      }
    };
   fetchCartProduct()
  },[])
 

  useEffect(()=>{
    const fetchCoupen=async()=>{
      try{
        await getAvailableCoupen(price,setCoupen)   
      }
      catch(error)
      {
       console.log(error)
      }
    };
   fetchCoupen()
  },[price])


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addressHandle = () => {
    setAdd(true);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { name, phone, streetAddress, state, district, pincode, city } = formData;
      if (name.trim().length === 0 && phone.trim().length === 0 && streetAddress.trim().length === 0 && state.trim().length === 0 && district.trim().length === 0 && pincode.trim().length === 0 && city.trim().length === 0) {
        toast.error("All fields should not be empty");
        return;
      }
      if (name.trim().length === 0 || phone.trim().length === 0 || streetAddress.trim().length === 0 || state.trim().length === 0 || district.trim().length === 0 || pincode.trim().length === 0 || city.trim().length === 0) {
        toast.error("Please fill empty field");
        return;
      }
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone.trim())) {
        toast.error("Phone number must contain exactly 10 digits");
        return;
      }

      const pin = /^[0-9]{6}$/;
      if (!pin.test(pincode.trim())) {
        toast.error("Pin code should be 6 digits");
        return;
      }
     await addAddress(name, phone, streetAddress, state, district, pincode,city, setAddress,setAdd, toast,setFormData)
    } catch (error) {
      console.log(error);
    }
  };

  const EditHandle = (id) => {
    Navigate(`/address/edit/${id}`);
  };


   const coupenApply=async()=>{
    if(coupenId)
    {
      toast.error("you alredy applied coupen ")
      return
    }
    if(coupenCode)
    { 
      const result=coupen.filter((item,index)=>coupenCode===item.coupenCode)
      console.log(result[0].minimumPurchase)
      if(result.length===0)
      {
        toast.error("please fill correct coupen code")
        return
      }
      else{ 
      
        const response =await coupenStatus(coupenCode,toast) 
        if(response)
          {   
         let newprice
         if(result[0].coupenType==='flat')
         {
          newprice=price-result[0].discountedAmount
          setDiscount(result[0].discountedAmount)
          setTotalprice(newprice+50)
          setCopenId(result[0]._id)
         }
         if(result[0].coupenType==='percentage')
          {
           newprice = price - Math.ceil((price * result[0].discountedAmount) / 100);
           setDiscount(Math.ceil((price * result[0].discountedAmount) / 100))
           setTotalprice(newprice+50)
           setCopenId(result[0]._id)
          }
        }
      }
    }
   }

 

  const checkOutHandler = async () => {
   setMod(true)
  };
  
  
  useEffect(() => {
    const processPayment = async () => {
      if (orderId && paymentMethod === "online payment") {
        try {
          await handlePayment(Razorpay,totalprice,orderId);
          Navigate('/order-confirm',{ state: { fromCheckout: true } })
        } catch (error) {
          console.error("Error in handlePayment:", error);
        }
      }
    };
  
    processPayment(); 
  }, [orderId]);
  









  const RemoveHandle = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You won’t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });
  
      if (result.isConfirmed) {
         await deletAddress(id,Swal,setAddress)
      }
    } catch (error) {
      console.log(error);
      Swal.fire('Error!', 'Something went wrong while deleting the address.', 'error');
    }
  };

  const cancelHandle = () => {
    setAdd(false);
  };
  
  
     useEffect(() => {
       const result = cartproduct.reduce((accumulator, current) => {
         const isOfferValid = new Date(current.product_id.offerId?.expiryDate) > new Date();
         const price = isOfferValid 
           ? Math.ceil(current.product_id.price - (current.product_id.price * current.product_id.offerId.offerAmount / 100))
           : current.product_id.price;
         const totalProductPrice = price * current.quantity;
         return accumulator + totalProductPrice;
       }, 0);
     setPrice(result)
     setTotalprice(result+50)
     }, [cartproduct]);
  

  const coupenremove=()=>{
   setCopenId("")
   setTotalprice(price+50)
   setDiscount() 
   setCoupencode("")
   toast.info("You removed applied coupen") 
  }
   const noHandle=()=>{
    setMod(false)
   }

   const yesHandle=async()=>{
    setMod(false)
      try {
        let tot=totalprice-50
         await createOrder(tot, selectedAddress, paymentMethod,coupenId,price,toast,Navigate,dispatch,logoutUser,setOrderId);  
                  
      } catch (error) {
       console.log(error)
      }
    
   }

   const coupenItem = coupen.map((item, index) => (
    <div
      key={index}
      className="flex flex-col p-4 mb-4 border border-gray-300 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold text-blue-600">{item.coupenCode}</p>
        <p className="text-sm text-gray-500">{item.coupenType}</p>
      </div>
      {item.coupenType==="flat"&&
      <p className="text-gray-700 mt-2">
        Discounted Amount: <span className="font-bold">₹{item.discountedAmount}</span>
      </p>
     }

   {item.coupenType==="percentage"&&
      <p className="text-gray-700 mt-2">
        Discounted Amount: <span className="font-bold">%{item.discountedAmount}</span>
      </p>
     }
    </div>
  ));
  

 
  const item = address.map((add) => (
    <div className="bg-white w-full md:w-48 p-3 rounded shadow" key={add._id}>
      <input type="radio" name="address" onChange={() => handleAddressChange(add._id)} />
      <div className="text-sm">
        <p className="font-medium">{add.name}</p>
        <p className="break-words">{add.streetAddress}</p>
        <p>{add.city}, {add.state} {add.district}</p>
        <p>Pincode: {add.pincode}</p>
        <p>Phone: {add.phone}</p>
      </div>
      <div className="mt-3 flex justify-between text-blue-500">
        <span className="cursor-pointer hover:text-blue-700" onClick={() => EditHandle(add._id)}>Edit</span>
        <span className="cursor-pointer hover:text-red-500" onClick={() => RemoveHandle(add._id)}>Remove</span>
      </div>
    </div>
  ));
  
  


  const cart = cartproduct.map((item, index) => (
    <div
      key={index}
      className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-lg hover:shadow-md border border-gray-200 mb-2"
    >
   
      <div className="flex-shrink-0">
        <img
          src={item.product_id.images[0]}
          className="w-12 h-12 object-cover rounded"
          alt={item.product_id.name}
        />
      </div>
      <div className="flex flex-col flex-grow">
        <p className="text-neutral-950 underline font-semibold">{item.product_id.name}</p>
        <span className="text-sm font-medium text-gray-600">Qty: {item.quantity}</span>
      </div>

      <div className="flex-shrink-0">
      {((item.product_id.offerId === null) || 
        (item.product_id.offerId && new Date(item.product_id.offerId?.expiryDate) < new Date())) && (
        <p className="text-red-700 font-medium mb-2">
           &#8377;{item.product_id.price * item.quantity}
        </p>
      )}


       {item.product_id.offerId  &&new Date(item.product_id.offerId?.expiryDate)>new Date()&& (
        <p className="text-red-700 font-medium mb-2">
           &#8377;{(Math.ceil(item.product_id.price - (item.product_id.offerId.offerAmount * item.product_id.price / 100)))*item.quantity}       
        </p>
      )}
      </div>
    </div>
  ));
  
  return (
    <>
    <Navbar user={user ? user.name : null}/>
    <motion.div
    className='  p-8 flex-1 min-h-screen bg-white relative pt-32'
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2 }}
  >
   {mod&&
   <div className="border-2 bg-white h-auto w-96 rounded-lg shadow-md p-6 text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  <p className="text-lg font-medium mb-4 text-gray-700 z-20">
    Are you sure you want to order this product?
  </p>
  <div className="flex justify-center space-x-4">
    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300" onClick={yesHandle}>
      YES
    </button>
    <button className="bg-red-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-red-400 transition duration-300" onClick={noHandle}>
      NO
    </button>
  </div>
</div>
}

      
      
    
  
    
    <div className="flex flex-col md:flex-row">  
      <div className='flex-1'>
      <div
        className="bg-white p-4 mt-4 shadow-md rounded-md w-full border border-gray-300 mb-4"
      onClick={addressManagement}>
       <h2 className="text-lg font-semibold mb-3 text-gray-800">Select address</h2>
      </div>
      {addr &&(<>
       
        <button
        className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition duration-200"
        onClick={addressHandle}
      >
        + Add a New Address
      </button>
        
        {add && (
         
          <form onSubmit={handleSubmit} className="space-y-4 border-double border-4 border-indigo-600 mt-2 p-4">
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="w-full md:w-1/2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                     
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">Street Address</label>
                  <textarea
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="4"
                   
                  />
                </div>
                
                
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="w-full md:w-1/4">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                 
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="w-full md:w-1/2 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    className="w-full md:w-1/4 py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={cancelHandle}
                  >
                    Cancel
                  </button>
                </div>
          </form>
        )}
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          {item} 
        </div>
        </>)}
        <div className="bg-white p-4 mt-4 shadow-md rounded-md w-full border border-gray-300">
  <h2 className="text-lg font-semibold mb-3 text-gray-800">Payment Method</h2>
  {selectedAddress && (
    <div className="space-y-3">
    
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md hover:shadow-sm border border-gray-200">
        <input
          type="radio"
          name="payment"
          id="cod"
          value="cash on delivery"
          disabled={dis}
          className="mt-1 accent-green-500"
          onChange={paymentHandle}
        />
        <div>
          <label htmlFor="cod" className="text-sm font-medium text-gray-700">
            Cash on Delivery
          </label>
          <p className="text-xs text-gray-500">Pay when you receive the product.</p>
        </div>
      </div>

      {/* Wallet Payment */}
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md hover:shadow-sm border border-gray-200">
        <input
          type="radio"
          name="payment"
          id="wallet"
          value="wallet payment"
          className="mt-1 accent-green-500"
          onChange={paymentHandle}
        />
        <div>
          <label htmlFor="wallet" className="text-sm font-medium text-gray-700">
            Wallet Payment
          </label>
          <p className="text-xs text-gray-500">Use your wallet balance to pay.</p>
        </div>
      </div>

      {/* Online Payment */}
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md hover:shadow-sm border border-gray-200">
        <input
          type="radio"
          name="payment"
          id="online"
          value="online payment"
          className="mt-1 accent-green-500"
          onChange={paymentHandle}
        />
        <div>
          <label htmlFor="online" className="text-sm font-medium text-gray-700">
            Online Payment
          </label>
          <p className="text-xs text-gray-500">Pay securely with Razorpay.</p>
        </div>
      </div>
    </div>
  )}
</div>

      </div>
  
  
      <div className="flex-1 p-4 ml-0 md:ml-4 shadow-md rounded-md h-min">
        <div className='flex flex-col'>
          <div className='bg-white'>
        <p className="text-emerald-700 underline font-semibold text-lg mb-4 text-center">
          Order Summary
        </p>
        {cart}
        <div className="text-gray-700 space-y-2">
          <div className="flex justify-between">
            <span className='ml-2'>Subtotal:</span>
            <span className="font-medium">&#8377;{price}</span>
          </div>

          <div className="flex justify-between">
            <span className='ml-2'>Shipping Charge:</span>
            <span className="font-medium">&#8377;50</span>
          </div>

          <div className="flex justify-between">
            <span className='ml-2'>discount:</span>
            <span className="font-medium text-green-600">-&#8377;{discount}</span>
          </div>
          <div className="flex justify-between">
            <span className='ml-2'>Shipping charge:</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          <hr className="my-2 border-t-2 border-gray-300" />
          <div className="flex justify-between text-lg font-semibold ml-2">
            <span>Total:&#8377;{totalprice}</span>
            <span></span>
          </div>
        </div>
        <button
          type="button"
          disabled={!payment}
          className={`py-2 px-6 ml-2 mb-1 rounded-lg font-semibold text-white transition-colors duration-300 shadow-md ${
            payment
              ? 'bg-green-500 hover:bg-green-600 active:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={checkOutHandler}
        >
          Proceed to Payment
        </button>
        <div>
        </div>
        <div>
        </div>
      </div> 
      </div>

      <br></br>
      {coupen.length>0 &&(
      <div>
      <div className="text-lg font-semibold text-gray-700">Coupon Available</div>
        <div className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={coupenCode}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e)=>setCoupencode(e.target.value)}
          />
          <button className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500" 
          onClick={coupenApply}  
        >
            Apply
          </button>
        {coupenId&&
          <button className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-blue-500" 
          onClick={coupenremove}  
        >
           remove
          </button>
        } 
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-4">
         {coupenItem}
        </div>
      </div>)}
   
    </div>
    </div>
    
    
  
    <Toaster />
  </motion.div>
  <Footer/>
  </>
  );
}

export default Checkout;
