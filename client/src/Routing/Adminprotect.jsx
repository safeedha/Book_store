import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Adminprotect({ children }) {
  const admin = useSelector((state) => state.admin?.adminInfo);
  return admin ? children : <Navigate to="/admin/login" />;
}

export default Adminprotect;
