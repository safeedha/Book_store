import React from 'react'
import Signup from './userComponnet/Signup';
import Login from "./userComponnet/Login";
import PasswordReset from "./userComponnet/PasswordReset";
import UserLoginProtect from "./Routing/UserLoginProtect";
import { Route } from "react-router-dom";
import VerifyOTP from './userComponnet/VerifyOTP'
function UserLoginRoutes() {
  return (
    <>
    <Route path='/signup' element={<UserLoginProtect><Signup /></UserLoginProtect>} />
    <Route path='/login' element={<UserLoginProtect><Login /></UserLoginProtect>} />
    <Route path='/forgot-password' element={<PasswordReset />} /> 
    <Route path='/otp' element={<VerifyOTP />} />
    
    </>
  )
}

export default UserLoginRoutes