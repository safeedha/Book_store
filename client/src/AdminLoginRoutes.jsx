import React from 'react'
import { Route } from "react-router-dom";
import AdminLoginProtect from './Routing/AdminLogin';
import AdminLogin from './adminComponent/AdminLogin'

function AdminLoginRoutes() {
  return (
    <>
      <Route path='/admin/login' element={<AdminLoginProtect><AdminLogin /></AdminLoginProtect>} />
    </>
  )
}

export default AdminLoginRoutes