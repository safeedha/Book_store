import instance from './instance'; 

export const profileUpdate=async(updatedData,dispatch,setUserDetails,setIsEditing,toast)=>{
  try{
    const response = await instance.post('/user/profile/update', updatedData);
    if(response.status==200)
    {
      
      toast.success("profile is updated")
      dispatch(setUserDetails(response.data.user))  
      setIsEditing(true)
    }

  }
  catch(error)
  {
     if(error.response.data.message==="this email already in use")
          {
            toast.error("This email already registerd")
            return
          }
          if(error.response.data.message==="this number already in use")
            {
              toast.error("this number already in use")
              return
          }
  }

}