import adminInstance from "./AdminInstance";

export const getAllproduct=async(setProduct)=>{
   try{
    const response = await adminInstance.get('/product');
    setProduct(response.data.product);
   }
   catch(error){
      console.log(error)
   }
}

export const changeStatus=async(status)=>{
   try{
      const response = await adminInstance.patch(`/product/${id}`, { status });
      return response
   }
   catch(error)
   {
    console.log(error)
   }
}


export const addofferProduct=async(productId,name,expiryDate,discount,setIsOpen,toast)=>{
   try{
      
      const response=await adminInstance.post("/offer/product",{productId,name,expiryDate,discount})
      if(response.status===200)
         {
           toast.success("Exist product offer upadted")
           setIsOpen(false)
         }
        
    if(response.status===201)
    {
      toast.success("Offer created sucessfully")
      setIsOpen(false)
    }
   }
   catch(error)
   {  console.log(error)
      if(error.response.status===409)
      {
         toast.error("offer already exist for this product")
         setIsOpen(false) 
      }
   }
}