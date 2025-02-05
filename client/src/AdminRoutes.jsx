import React from 'react'
import { Route } from "react-router-dom";
import Dashbord from "./adminComponent/Dashbord";
import Getcustomer from "./adminComponent/Getcustomer";
import Editcustomer from "./adminComponent/Editcustomer";
import GetCategory from "./adminComponent/GetCategory";
import AddCategory from "./adminComponent/AddCategory";
import Getproduct from "./adminComponent/Getproduct";
import AddProduct from "./adminComponent/Addproduct";
import EditCategory from "./adminComponent/Editcategory";
import Editproduct from "./adminComponent/Editproduct";
import Adminprotect from "./Routing/Adminprotect";
import AdminOrder from './adminComponent/AdminOrder';
import SingleOrder from './adminComponent/SingleOrder';
import GetCoupe from './adminComponent/GetCoupe';
import Return from './adminComponent/Return';
import Offer from './adminComponent/Offer';
import Test from './adminComponent/Test';
import Salaesreport from './adminComponent/Salesreport';
import Trending from './adminComponent/Trending';



function AdminRoutes() {
  return (
   <>
  
       <Route path='/admin/dashboard' element={<Adminprotect><Dashbord/></Adminprotect>} />
       <Route path='/admin/sales' element={<Adminprotect><Salaesreport/></Adminprotect>} />
        <Route path="/admin/customer" element={<Adminprotect><Getcustomer /></Adminprotect>} />
        <Route path="/admin/customer" element={<Adminprotect><Getcustomer /></Adminprotect>} />
        <Route path="/admin/customer/:id" element={<Adminprotect><Editcustomer /></Adminprotect>} />
         <Route path="/admin/category" element={<Adminprotect><GetCategory /></Adminprotect>} />
        <Route path="/admin/category/add" element={<Adminprotect><AddCategory /></Adminprotect>} /> 
        <Route path="/admin/category/:id" element={<Adminprotect><EditCategory /></Adminprotect>} />   
        <Route path="/admin/product" element={<Adminprotect><Getproduct /></Adminprotect>} />
        <Route path="/admin/product/add" element={<Adminprotect><AddProduct /></Adminprotect>} /> 
        <Route path="/admin/product/:id" element={<Adminprotect><Editproduct /></Adminprotect>} />
        <Route path="/admin/orders" element={<Adminprotect><AdminOrder /></Adminprotect>} /> 
        <Route path="/admin/order-details/:itemId/:prodId" element={<Adminprotect><SingleOrder /></Adminprotect>} /> 
        <Route path="admin/coupen" element={<Adminprotect><GetCoupe /></Adminprotect>} /> 
        <Route path="/admin/return" element={<Adminprotect><Return /></Adminprotect>} />
        <Route path="/admin/return" element={<Adminprotect><Return /></Adminprotect>} /> 
        <Route path="/admin/offer" element={<Adminprotect><Offer /></Adminprotect>} />
        <Route path="/admin/test" element={<Adminprotect><Test /></Adminprotect>} />  
        <Route path="/admin/trending" element={<Adminprotect><Trending /></Adminprotect>} />
        
   </>
  )
}

export default AdminRoutes