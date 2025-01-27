import adminInstance from "./AdminInstance";

export const getAllCategory=async(setCategory)=>{
try{
  const response = await adminInstance.get("/category");
  setCategory(response.data.category);
}
catch(error)
{
   console.log(error)
}
}


export const categoryBlock=async(id,setCategory,Swal,status,category)=>{
  try{
  const response = await adminInstance.patch(`/category/${id}`, { status });
        if (response) {
          const updatedUser = category.map((doc) =>
            doc._id === id ? { ...doc, status } : doc
          );
          setCategory(updatedUser);
  
          Swal.fire(
            "Success!",
            `The category has been ${status === "block" ? "blocked" : "unblocked"}.`,
            "success"
          );
        
}
  }
  catch(error)
  {
    console.log(error)
  }
}

export const getOneCetegory=async(id,setCategoryName,setImage)=>{
try{   
  const response = await adminInstance.get(`/category/${id}`);
  console.log("Category Data:", response.data);
  setCategoryName(response.data.category.name)
  setImage(response.data.category.image)
}
catch(error)
{
  console.log(error)
}
}


export const updateCategory=async(id,formattedCategoryName,uploadedUrl,navigate,toast)=>{
  try{
    const res=await adminInstance.post(`/category/${id}`,{formattedCategoryName,uploadedUrl})
    if(res.status===200)
    {
        navigate(-1)
    }
  }
  catch(error)
  {
     if(error.response.data.message==="Category name already exists")
          {
            toast.error("Category name already exists")
          }
          console.log(error)
  }
}


export const AddofferfromCategory=async(catid,name,expiryDate,discount,setIsOpen,toast)=>{
   try{
    const response=await adminInstance.post("/offer/category",{catid,name,expiryDate,discount})
    if(response.status===201)
    {
      toast.success("Offer created sucessfully")
      setIsOpen(false)
    }
   }
   catch(error)
   {
     if(error.response.status===409)
     {
      toast.error("offer already exist for this category,You can only edit and delete this offer")
      setIsOpen(false)
     }
   }
}