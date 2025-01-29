import React, { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {setAdmindetails ,logoutAdmin} from '../feature/adminSlice'
import { useDispatch } from "react-redux";
import { adminlogin} from './AdminApi/AdminLogin'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate=useNavigate()
  const dispatch=useDispatch()

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     await adminlogin(email, password,dispatch,setAdmindetails,toast,Navigate)
    } catch (error) {

     console.log(error)
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
         <Toaster position="top-center" richColors />
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Login
        </button>
      </form>

      <br />
    
    </div>
  </div>
  );
};

export default Login;
