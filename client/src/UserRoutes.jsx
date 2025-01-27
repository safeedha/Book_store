import React from 'react'
import { Route } from "react-router-dom";
import Profile from "./userComponnet/pages/Profile";
import Order from "./userComponnet/pages/Order";
import Changepassword from "./userComponnet/pages/Changepassword";
import Address from "./userComponnet/pages/Address";
import Editaddress from "./userComponnet/pages/Editaddress";
import Cart from "./userComponnet/pages/Cart";
import Checkout from "./userComponnet/pages/Checkout";
import Order_confirm from "./userComponnet/pages/Order_confirm";
import Userprotect from "./Routing/Userprotect";
import ProductDetails from './userComponnet/pages/ProductDetails';
import WishList from './userComponnet/pages/WishList';
import Wallet from './userComponnet/pages/Wallet';
function UserRoutes() {
  return (
   <>
        <Route path='/profile' element={<Userprotect><Profile /></Userprotect>} />
        <Route path='/address' element={<Userprotect><Address /></Userprotect>} />   
        <Route path='/address/edit/:id' element={<Userprotect><Editaddress /></Userprotect>} />
        <Route path='/profile/password' element={<Userprotect><Changepassword /></Userprotect>} />
        <Route path='/order' element={<Userprotect><Order /></Userprotect>} />
        <Route path='/cart' element={<Userprotect><Cart /></Userprotect>} />
        <Route path='/checkout' element={<Userprotect><Checkout /></Userprotect>} />
        <Route path='/order-confirm' element={<Userprotect><Order_confirm /></Userprotect>} />
        <Route path="/order/:orderid/product/:productid" element={<Userprotect><ProductDetails /></Userprotect>} />
        <Route path="/wishlist" element={<Userprotect><WishList /></Userprotect>} />
        <Route path="/wallet" element={<Userprotect><Wallet /></Userprotect>} />
   </>
  )
}

export default UserRoutes