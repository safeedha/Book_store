import adminInstance from "./AdminInstance"

export const coupencreation = async (
  copencode,
  copentype,
  minimumPurchase,
  discount,
  limit,
  selectedDate,
  toast,
  setIsOpen,
  setCoupadd
) => {
  try {
    console.log(copencode, copentype, minimumPurchase, discount, limit, selectedDate);
    const response = await adminInstance.post("/coupen", {
      copencode,
      copentype,
      minimumPurchase,
      discount,
      limit,
      selectedDate,
      
    });   
    console.log(response);
        if (response.status === 201)
         {
          setIsOpen(false);
          toast.success("Coupon created successfully");
          setCoupadd(true)
        }

  } catch (error) {
   if(error.response.status===409)
   {
    toast.error("duplicte code")
   }
   
  }
};


export const getAllcopen=async(setCoupen)=>{
   try{
     const response = await adminInstance.get("/coupen")
     console.log(response.data.coupen)
     setCoupen(response.data.coupen)
   }
   catch(error)
   {
     console.log(error)
   }
}

export const coupenDelet=async(id,setCoupen)=>{
  try{
    const response=await adminInstance.patch(`/coupen/${id}`)
    setCoupen(response.data.coupen)
  }
  catch(error){

  }
}