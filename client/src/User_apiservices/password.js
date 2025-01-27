import instance from './instance'; 

export const passwordReset=async(email,newPassword,navigate,toast)=>{
  try{
   const response = await instance.post("/user/resetpassword", {
           email,
           newPassword,
         });
      
         if (response.status === 200) {
          toast.success("Password reset successfully,now you can login");
          setTimeout(() => {
            navigate('/login');
          }, 200);
          
        }
  }
  catch(error)
  {
    toast.error(error.response.data.message)
  }
}


export const changePassword = async (userId, newPassword, setNewPassword, setConfirmPassword,toast) => {
  try {
    const response = await instance.patch(`/user/profile/update/${userId}`, { newPassword });

    if (response.status === 200) {
      console.log("Password change response:", response);
      toast.success('Password changed successfully');
      setNewPassword(""); 
      setConfirmPassword(""); 
    }
  } catch (error) {
    if (error.response) {
      const { message } = error.response.data;
      toast.error(message || 'Failed to change password. Please try again.');
    } else {
      toast.error('An unexpected error occurred. Please try again later.');
    }
    console.error('Error changing password:', error);
  }
};
