import adminInstance from "./AdminInstance";

export const adminlogin=async(email, password,dispatch,setAdmindetails,toast,Navigate)=>{
  try{
    const response = await adminInstance.post("/login", { email, password });
    console.log(response.data.admin)
    dispatch(setAdmindetails(response.data.admin))
    toast.success("Admin authenticated successfully!");
    setTimeout(() => {
      Navigate('/admin/dashboard')
    }, 2000);

  }
  catch(error)
  {
      if (error.response && error.response.data.message) {
           toast.error(error.response.data.message);
         } else {
           toast.error("Something went wrong. Please try again later");
         }
  }
}