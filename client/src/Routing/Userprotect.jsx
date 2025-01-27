import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function Userprotect({ children }) {
  const user = useSelector((state) => state.user.userInfo);

  return user ? children : <Navigate to="/" />;
}

export default Userprotect;
