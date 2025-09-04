import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { getOneCetegory, updateCategory } from './AdminApi/Category';
import Sidebar from './Sidebar';


const EditCategory = () => {

  const [categoryName, setCategoryName] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [image, setImage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getSingleCategory = async () => {
      try {
        await getOneCetegory(id, setCategoryName, setImage);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };
    if (id) {
      getSingleCategory();
    }
  }, [id]);

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!categoryName) {
        setError('Category name is required.');
        return;
      }
      let uploadedUrl = image;
      const isValidCategory = /^[A-Za-z]+$/.test(categoryName);

      if (!isValidCategory) {
        toast.error('Category name must contain only English letters.');
        return;
      }
      const formattedCategoryName =
        categoryName.charAt(0).toUpperCase() +
        categoryName.slice(1).toLowerCase();
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'products');
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dwerqkqou/image/upload',
          formData
        );
        uploadedUrl = response.data.secure_url;
      }
      await updateCategory(
        id,
        formattedCategoryName,
        uploadedUrl,
        navigate,
        toast
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Sidebar />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-indigo-200">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h3 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Edit Category
          </h3>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 text-sm rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleFormSubmit}>
            <Toaster position="top-center" richColors />
            <div className="mb-4">
              <label
                htmlFor="categoryName"
                className="block text-sm font-semibold text-gray-700"
              >
                Category Name
              </label>
              <input
                type="text"
                id="categoryName"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="categoryImage"
                className="block text-sm font-semibold text-gray-700"
              >
                Upload File
              </label>
              <input
                type="file"
                id="categoryImage"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile);
                  const url = URL.createObjectURL(selectedFile);
                  setImage(url);
                }}
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center justify-center">
              <img
                src={image}
                alt="Category"
                className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition font-semibold"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
