import adminInstance from "./AdminInstance";

export const getTopProduct=async(setProduct)=>{
  try{
  const response=await adminInstance.get('/topproduct')
  setProduct(response.data.product)
  }
  catch(error){
    console.log(error)
  }
}


export const getTopCategory=async(setCategory)=>{
  try{
  const response=await adminInstance.get('/topcategory')
  setCategory(response.data.category)
  }
  catch(error){
    console.log(error)
  }
}