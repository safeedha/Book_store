import adminInstance from "./AdminInstance"

export const getUser=async(setUser,dispatch,Navigate)=>{
  try{
    const response=await adminInstance.get('/customer')
    setUser(response.data.customer)
  }
  catch(error){
    if(error.response.data.message==="Refresh token not found. Please log in again.")
      {
           dispatch(logoutAdmin())
      }
  }
}



export const userStatusUpdate=async(id,setUser,status,user)=>{
 try{
  const response=await adminInstance.patch(`/customer/${id}`,{status})
  if(response)
  {
   console.log(response)
   const updatedUser = user.map((doc) => 
     doc._id === id ? { ...doc, status } : doc
   );
    setUser(updatedUser)
  }
 }
 catch(error)
 {
  if(error.response.data.message==="Refresh token not found. Please log in again.")
    {
         dispatch(logoutAdmin())
    }
 }
}