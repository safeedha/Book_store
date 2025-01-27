import React, { useState,useEffect } from "react";
import axios from "axios";
import Crop from "@/Reusable/Crop";
import { useSelector } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import adminInstance from "@/Api/adminInstance";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";


const AddProduct = () => {
  const navigate=useNavigate()
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState("");
  const [sku, setSku] = useState("");
  const [productImage,setProductImage]=useState(null)
  const croped = useSelector((state) => state.image.imageurl);
  const [crop,setCrop]=useState([])
  const [cateList,setCateList]=useState([])
 
  useEffect(()=>{
    const fetchCategory = async () => {
      try {
        const response = await adminInstance.get('/category');
        console.log(response.data.category); 
        setCateList(response.data.category)
      } catch (error) {
        toast.error("Error fetching category data:")
        console.error("Error fetching category data:", error); 
      }
    };
    
  fetchCategory(); 
  },[])
  
useEffect(()=>{
  if(croped=="")
  {
    return
  }
    if(crop.length===4)
    {
      alert("only 4 image can be uplaodable")
      setImages("")
         return
    }
  console.log("the croped",croped)
  let item = [...crop]; 
  item.push(croped);   
  setCrop([...item]);
  console.log("that was smooth")
},[croped])
 
  const handleFileChange = (e) => {
    setProductImage(e.target.files[0])
    const url=URL.createObjectURL(e.target.files[0]); 
    setImages(url)
  }

  const handleSubmit= async(e)=>{
    try{
      e.preventDefault()
      let uploaded=[]

     console.log(productName,description,author,language,price,category,stock,sku)
     if (productName.trim().length === 0) {
      toast.error("Product Name cannot be empty");
      return;
    }
    
    if (description.trim().length === 0) {
      toast.error("Description cannot be empty");
      return;
    }
    
    if (author.trim().length === 0) {
      toast.error("Author cannot be empty");
      return;
    }
    
    if(sku.trim().length === 0) {
      toast.error("SKU cannot be empty");
      return;
    }
    
     if(crop.length!==4)
     {
      toast.error("To submit need 4 images of that product")
      return
     }
     for (let i = 0; i < crop.length; i++) {
      const formData = new FormData();
      const base64Data = crop[i].replace(/^data:image\/\w+;base64,/, '');
      const blob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], {
        type: 'image/jpeg',
      });
      formData.append('file', blob);
      formData.append('upload_preset', 'products');
      const uploadResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dwerqkqou/image/upload',
        formData
      );
      const imageUrl = uploadResponse.data.secure_url;
      uploaded.push(imageUrl);
    }
    console.log(uploaded)
    const formatProductName = productName.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    const response=await adminInstance.post('/product',{formatProductName,description,author,language,price,category,stock,sku,uploaded})
     if(response.status===201)
     {
      setCrop([])
      toast.success("product addedd suceesfully")
      setTimeout(() => {
        navigate('/admin/product');
      }, 3000);
     }
    }
    catch(error)
    {
      console.log(error)
      if(error.response.status===409)
      {
        toast.error("This product already exist")
      }
    }
     
  }
  
  const opt = cateList.map((doc) => (
    <option key={doc.id} value={doc.name}>
      {doc.name}
    </option>
  ));
  

  return (
    <div className="flex">
    <Toaster position="top-center" richColors />
    <div>
      <Sidebar />
    </div>
    <div className="ml-48 p-3 bg-gray-200 w-full" >
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Add a New Product</h2>
      <Toaster position="top-center" richColors />
      <form className="space-y-6" onSubmit={handleSubmit} p-4>
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-800">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-800">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-800">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-800">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>Select Language</option>
            <option value="Malayalam" >malayalam</option>
            <option value="English" >English</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-800">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => {
             
              setPrice(e.target.value);
            }}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-800">Category</label>
          <select
          
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>Select categorie</option>
            {opt}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-800">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-800">SKU</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input
            type="file"
            name="productImage"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        </div>
        <div className="flex justify-center space-y-5">
          {images && <Crop url={images} />}


          {crop.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-700">Cropped Images</h3>
            <div className="grid grid-cols-2 gap-4">
              {crop.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Cropped ${index + 1}`}

                  className="w-full h-32 object-cover rounded-md shadow-md"
                />
              ))}
            </div>
          </div>
        )}
         
        </div>     

        <input type='submit'
          className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
      </form>
    </div>
    </div>
  );
};

export default AddProduct;
