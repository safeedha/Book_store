import instance from "./instance";

export const fetchCart=async(setCartproduct,dispatch,logoutUser,Navigate,toast)=>{
try{
  const response = await instance.get('/user/cart');
  if (response.status === 200) {
    console.log(response.data.cart)
    setCartproduct(response.data.cart);
  }
}
catch(error)
{
  if (error.response?.data?.message === "User blocked") {
    toast.error("Your account is temporarily blocked");
    dispatch(logoutUser());
    Navigate('/');
  } else {
    toast.error(error.response?.data?.message )
  }
}
}



export const deleteCart=async(id,setCartproduct,Swal)=>{
 try{
        const response = await instance.delete(`/user/cart/${id}`);
         if (response.status === 200) {
           setCartproduct(response.data.remains); 
           Swal.fire('Deleted!', 'The item has been deleted.', 'success'); 
         }
 }
 catch(error)
 {
     console.error('Error deleting the item:', error);
      Swal.fire('Error!', 'Failed to delete the item. Please try again.', 'error'); 

 }
}


export const addCartQuantity = async (id1, productid,setCartproduct,toast,logoutUser,dispatch) => {
  try {
    const response = await instance.post(`/user/cart/add/${id1}`, { productid });

    if (response.status === 200) {
      setCartproduct(response.data.cart);
      toast.success("Product quantity updated successfully!");
    }
  } catch (error) {
    if (error.response) {
      const { message, cart } = error.response.data;

      if (message === "User blocked") {
        toast.error("Your account is blocked. You can't add products to the cart.");
        setTimeout(() => {
          dispatch(logoutUser());
        }, 200);
        return;
      }

      if (
        message === "This product is out of stock and removed from your cart" ||
        message === "Quantity exceeded stock. Updated to available stock."
      ) {
        toast.error(message);
        setCartproduct(cart);
        return;
      }

      toast.error(message || "An error occurred while updating the cart.");
    } else {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  }
}

export const subCartQuantity=async(id1,productid,setCartproduct, dispatch,logoutUser,toast)=>{
  try{
    
    const response=await instance.post(`/user/cart/sub/${id1}`, {productid})
    if(response.status===200)
    {
      setCartproduct(response.data.cart)
    }
   }
   catch(error)
   {

    if(error.response.data.message==="User blocked")
      {
        toast.error("Your acoount is blocked you can't add produt to cart")
        setTimeout(()=>{
          dispatch(logoutUser())
        },2000)
        return
      }
      if(error.response.data.message==="This product is out of stock and removed from your cart"||error.response.data.message==="Quantity exceeded stock. Updated to available stock.")
        {
          toast.error(error.response.data.message)
          setCartproduct(error.response.data.cart)
          return
        }


    if(error.response.status===400)
    {
      toast.error(error.response.data.message)
    }
    console.log(error)
   }
}