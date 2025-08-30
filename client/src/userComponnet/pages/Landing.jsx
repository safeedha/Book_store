import React, { useEffect } from 'react';
import Navbar from '@/Reusable/Navbar';
import About from '@/Reusable/About';
import Footer from '@/Reusable/Footer';
import { useSelector } from 'react-redux';
import Newarrival from '@/Reusable/Newarrival';

function Landing() {
  const user = useSelector((state) => state.user.userInfo);

  return (
    <>
      <Navbar user={user ? user.name : null} />
      <About />
      <Newarrival />
      <Footer />
    </>
  );
}

export default Landing;
