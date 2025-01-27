import React, { useState } from "react";
import axios from 'axios'
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import adminInstance from "@/Api/adminInstance";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState("");  // Changed from array to a single image
  const [previewUrl, setPreviewUrl] = useState("");  // Single preview URL
  const navigate=useNavigate()
  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];  
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));  
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (categoryName.trim().length === 0) {
          toast.error("category Name cannot be empty");
          return;
        }
   
    const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
    setCategoryName(formattedCategoryName); 
    if (!categoryName || !image) {
      toast.error("Please provide a category name and upload an image.");
      return;
    } 
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "products");
  
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dwerqkqou/image/upload",
        formData
      );
      const uploadedUrl = response.data.secure_url;
      console.log(uploadedUrl,categoryName);
      const response2=await adminInstance.post('/category',{uploadedUrl,formattedCategoryName})
      console.log(response2)
      if(response2.status===201)
      {
        navigate(-1)
      }
  
      setCategoryName("");
      setImage("");
      setPreviewUrl("");
    } 
      catch (err) {
      console.log(err);
      if(err.response.status===409)
      {
        toast.error("This category alredy exist")
        return;
      }
    }
  };
  















  
  return (
    <div className="flex">
    {/* Sidebar */}
    <Sidebar />
  
    {/* Main Content */}
    <div className="ml-48 bg-gray-200 min-h-screen w-full">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded shadow-md w-[400px]">
          <Toaster position="top-center" richColors />
          <h2 className="text-2xl font-bold text-center mb-6">Add Category</h2>
  
          {/* Form */}
          <form onSubmit={handleFormSubmit}>
            {/* Category Name */}
            <div className="mb-4">
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category Name
              </label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={handleCategoryNameChange}
                placeholder="Enter category name"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
  
            {/* Upload Image */}
            <div className="mb-4">
              <label
                htmlFor="imageUpload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Category Image
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
  
            {/* Preview Image */}
            {previewUrl && (
              <div className="mb-4 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border"
                />
              </div>
            )}
  
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default AddCategory;
