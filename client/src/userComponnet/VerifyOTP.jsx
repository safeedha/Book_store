import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import instance from '../instance';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";



function VerifyOTP() {
  const[otp,setOtp]=useState("")
  const location = useLocation();
  const email=location.state.email
  console.log(email)
  const navigate=useNavigate()

  const verification = async (e) => {
    try {
      e.preventDefault()
      const response = await instance.post('user/otpverification', { otp, email });
      console.log(response)
      if (response.status === 200) {
        toast.success("OTP verification successful, now you can login");
        setTimeout(() => {
          navigate('/login');  
        }, 2000); 

        
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.message ==="Invalid OTP. Please try again.") {
          toast.error("incorrect OTP");
        } else {
          toast.error("otp validity expired please resend it");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
  };


  const resend=async()=>{
    try{
      console.log("hello")
      console.log(email)
      const response = await instance.post('user/resend', {email});
      if(response.status===200)
      {
        toast.success("otp resented ,please verify")
      }
    }
    catch(error)
    {
      toast.error("Failed to resend OTP. Please try again later")
    }
  }
  
   


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Accoun verification
        </h2>
        <Toaster position="top-center" richColors />
        <p className="mt-2 text-center text-sm text-gray-500">
          Please enter the OTP sent to your registered email.
        </p>
        <form className="mt-6 space-y-4" onSubmit={verification}>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Enter OTP
            </label>
            <input
              type="text"
              name="otp"
              id="otp"
              maxLength="6"
              required
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter 6-digit OTP"
              onChange={(e)=>setOtp(e.target.value)}
            />
          </div>

          <input
            type="submit" 
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            value="Verify otp"
           
          />
            
        
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the OTP?{' '}
            <button
              type="button"
              className="font-medium text-indigo-600 hover:underline"
              onClick={resend}
            >
              Resend OTP
            </button>
          </p>
          <p className="mt-1 text-xs text-gray-400">
            You can resend OTP in <span className="font-medium">3</span> minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
