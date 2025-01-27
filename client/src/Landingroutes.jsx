import React from 'react'
import { Route } from "react-router-dom";
import Landing from './userComponnet/pages/Landing';
import About from './Reusable/About';
import Product from './userComponnet/pages/Product';
import Singleproduct from './userComponnet/pages/Singleproduct';
function Landingroutes() {
  return (
    <>
         <Route path='/' element={<Landing />} />
        <Route path='/about' element={<About />} />            
        <Route path='/product' element={<Product />} />
        <Route path='/product/:id' element={<Singleproduct />} />
    
    </>
  )
}

export default Landingroutes