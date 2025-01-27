import instance from './instance'; 

export const wishListadd=async(setFilled,toast,id)=>{
  try{
  setFilled(true)
  const response=await instance.post("/user/wishlist/add", {productId:id})  
  if(response.status===200)
  {
    toast.success("product added to wishlist sucessfully")
  }
  }
  catch(error)
  {
    if(error.response.status===403)
    {
      toast.error("Your acount temperarly blocked")
    }
  }
}


export const wishListremove=async(setFilled,toast,id)=>
{
  try{
        setFilled(false)
        const response=await instance.post("/user/wishlist/remove", {productId:id})
        if(response.status===200)
        {
          setFilled(false)
        toast.info("Product removed from Wishlist")

       }    
  }
  catch{
   if(error.response.status===403)
   {
    toast.error("User is blocked,You can add more product to wishList")
   }
  }
}


export const WishListSatus=async(id,setFilled,dispatch,logoutUser)=>{
  try{
    let productId=id
    const response = await instance.get(`/user/wishlist/${productId}`)
    if(response.status===200)
    {
      setFilled(true)
    }
   
  }
  catch(error)
  {
    if(error.response.status===403)
      {
        dispatch(logoutUser())
        return
      }
   if(error.response.status===404)
   {
    setFilled(false)
    return
   }
  }
}


export const getWishList=async(setWish,dispatch,logoutUser)=>{
  try{
    console.log("hello world")
     const response=await instance.get("/user/wishlist")
     console.log(response.data.item)
     setWish(response.data.item)
   
     
  }
  catch(error)
  {
    if(error.response.status===403)
    {
      dispatch(logoutUser())
    }
    console.log(error)
  }
}

export const delteFromwishlist=async(id,setWish)=>{
  try{
    const response=await instance.post("/user/wishlist/remove", {productId:id})
    if(response.status===200){
      console.log(response.data.item)
      setWish(response.data.item)
    }
  }
  catch(error)
  {
    console.log(error)
  }
}