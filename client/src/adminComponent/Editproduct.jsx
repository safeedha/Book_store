// import  { useState, useEffect } from 'react';
// import { Toaster } from '@/components/ui/sonner';
// import { toast } from 'sonner';
// import adminInstance from './AdminApi/AdminInstance';
// import { useParams, useNavigate } from 'react-router-dom';
// import CropImage from '@/Reusable/CropImage';
// import Crop from '@/Reusable/Crop';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import Sidebar from './Sidebar';
// import { useDispatch } from 'react-redux';
// import { logoutAdmin } from '../feature/adminSlice';

// function Editproduct() {
//   const dispatch = useDispatch();
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [productName, setProductName] = useState('');
//   const [description, setDescription] = useState('');
//   const [author, setAuthor] = useState('');
//   const [language, setLanguage] = useState('');
//   const [price, setPrice] = useState(0);
//   const [category, setCategory] = useState('');
//   const [stock, setStock] = useState(0);
//   const [sku, setSku] = useState('');

//   const [image, setImage] = useState([]);
//   const [cateList, setCateList] = useState([]);
//   const [image1, setImage1] = useState(null);
//   const [image2, setImage2] = useState(null);
//   const [image3, setImage3] = useState(null);
//   const [image4, setImage4] = useState(null);
//   const croped = useSelector((state) => state.image.imageurl);
//   const croped2 = useSelector((state) => state.image.imageurl2);
//   const croped3 = useSelector((state) => state.image.imageurl3);
//   const croped4 = useSelector((state) => state.image.imageurl4);



//   useEffect(() => {
//     const fetchCategory = async () => {
//       try {
//         const response = await adminInstance.get('/category/all');
        
//         setCateList(response.data.categories);
//       } catch (error) {
//         toast.error('Error fetching category data:');
//         console.error('Error fetching category data:', error);
//       }
//     };

//     fetchCategory();
//   }, []);

//   useEffect(() => {
//     setImage1(null);
//   }, [croped]);

//   useEffect(() => {
//     setImage2(null);
//   }, [croped2]);

//   useEffect(() => {
//     setImage3(null);
//   }, [croped3]);

//   useEffect(() => {
//     setImage4(null);
//   }, [croped4]);

//   useEffect(() => {
//     const getSingleProduct = async () => {
//       try {
//         const response = await adminInstance.get(`/product/${id}`); // Assuming `id` is defined
//         setProductName(response.data.product.name);
//         setDescription(response.data.product.description);
//         setAuthor(response.data.product.author);
//         setLanguage(response.data.product.language);
//         setPrice(response.data.product.price);
//         setStock(response.data.product.stock);
//         setCategory(response.data.product.categoryId.name);
//         setSku(response.data.product.sku);
//         setImage(response.data.product.images);
//       } catch (error) {
//         if(error)
//         {
//         dispatch(logoutAdmin());
//         }
//       }
//     };
//     if (id) {
//       getSingleProduct();
//     }
//   }, [id,dispatch]);

//   const handleSubmit = async (e) => {
//     try {
//       e.preventDefault();
//       if (!productName || !description || !author || !sku) {
//         let emptyFields = [];

//         if (!productName) emptyFields.push('Product Name');
//         if (!description) emptyFields.push('Description');
//         if (!author) emptyFields.push('Author');
//         if (!sku) emptyFields.push('SKU');

//         toast.error(
//           `The following fields are required: ${emptyFields.join(', ')}`
//         );
//         return;
//       }

//       if (productName.trim().length === 0) {
//         toast.error('Product Name cannot be empty');
//         return;
//       }

//       if (description.trim().length === 0) {
//         toast.error('Description cannot be empty');
//         return;
//       }

//       if (author.trim().length === 0) {
//         toast.error('Author cannot be empty');
//         return;
//       }

//       if (sku.trim().length === 0) {
//         toast.error('SKU cannot be empty');
//         return;
//       }
//       let u1 = image[0];
//       let u2 = image[1];
//       let u3 = image[2];
//       let u4 = image[3];
//       if (croped) {
//         const formData = new FormData();
//         const base64Data = croped.replace(/^data:image\/\w+;base64,/, '');
//         const blob = new Blob(
//           [Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))],
//           {
//             type: 'image/jpeg',
//           }
//         );
//         formData.append('file', blob);
//         formData.append('upload_preset', 'products');
//         const uploadResponse = await axios.post(
//           'https://api.cloudinary.com/v1_1/dwerqkqou/image/upload',
//           formData
//         );
//         const imageUrl = uploadResponse.data.secure_url;
//         u1 = imageUrl;
//       }

//       if (croped2) {
//         const formData = new FormData();
//         const base64Data = croped2.replace(/^data:image\/\w+;base64,/, '');
//         const blob = new Blob(
//           [Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))],
//           {
//             type: 'image/jpeg',
//           }
//         );
//         formData.append('file', blob);
//         formData.append('upload_preset', 'products');
//         const uploadResponse = await axios.post(
//           'https://api.cloudinary.com/v1_1/dwerqkqou/image/upload',
//           formData
//         );
//         const imageUrl = uploadResponse.data.secure_url;
//         u2 = imageUrl;
//       }
//       if (croped3) {
//         const formData = new FormData();
//         const base64Data = croped3.replace(/^data:image\/\w+;base64,/, '');
//         const blob = new Blob(
//           [Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))],
//           {
//             type: 'image/jpeg',
//           }
//         );
//         formData.append('file', blob);
//         formData.append('upload_preset', 'products');
//         const uploadResponse = await axios.post(
//           'https://api.cloudinary.com/v1_1/dwerqkqou/image/upload',
//           formData
//         );
//         const imageUrl = uploadResponse.data.secure_url;
//         u3 = imageUrl;
//       }
//       if (croped4) {
//         const formData = new FormData();
//         const base64Data = croped3.replace(/^data:image\/\w+;base64,/, '');
//         const blob = new Blob(
//           [Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))],
//           {
//             type: 'image/jpeg',
//           }
//         );
//         formData.append('file', blob);
//         formData.append('upload_preset', 'products');
//         const uploadResponse = await axios.post(
//           'https://api.cloudinary.com/v1_1/dwerqkqou/image/upload',
//           formData
//         );
//         const imageUrl = uploadResponse.data.secure_url;
//         u4 = imageUrl;
//       }
//       const crop = [u1, u2, u3, u4];
//       const formatProductName = productName
//         .toLowerCase()
//         .replace(/\b\w/g, (char) => char.toUpperCase());
//       console.log(formatProductName);
//       const response = await adminInstance.post(`/product/${id}`, {
//         formatProductName,
//         description,
//         author,
//         language,
//         price,
//         category,
//         stock,
//         sku,
//         crop,
//       });
//       console.log(response);
//       if (response.status === 200) {
//         navigate(-1);
//       }
//     } catch (error) {
//       console.log(error);
//       if (error.response.data.meassage === 'Product already exists') {
//         toast.error('Product already exists');
//         return;
//       }
//       if (
//         error.response.data.meassage === 'Product with this SKU already exists'
//       ) {
//         toast.error('Product with this SKU already exists');
//         return;
//       }
//     }
//   };

//   const waw = cateList.map((doc) => (
//     <option key={doc.id} value={doc.name}>
//       {doc.name}
//     </option>
//   ));

//   const handleFilechange = (e) => {
//     const file = e.target.files[0];
//     console.log(URL.createObjectURL(file));
//     setImage1(URL.createObjectURL(file));
//   };

//   const handleFilechange2 = (e) => {
//     const file = e.target.files[0];
//     console.log(URL.createObjectURL(file));
//     setImage2(URL.createObjectURL(file));
//   };

//   const handleFilechange3 = (e) => {
//     const file = e.target.files[0];
//     console.log(URL.createObjectURL(file));
//     setImage3(URL.createObjectURL(file));
//   };

//   const handleFilechange4 = (e) => {
//     const file = e.target.files[0];
//     console.log(URL.createObjectURL(file));
//     setImage4(URL.createObjectURL(file));
//   };

//   return (
//     <>
//       <Sidebar />
//       <div className="bg-gray-200 text-gray-800 rounded-lg shadow-lg">
//         <div className="max-w-4xl mx-auto p-8">
//           <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
//             Edit product
//           </h2>
//           <Toaster position="top-center" richColors />
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div className="space-y-2">
//               <label className="block text-lg font-medium text-gray-800">
//                 Product Name
//               </label>
//               <input
//                 type="text"
//                 value={productName}
//                 onChange={(e) => setProductName(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-lg font-medium text-gray-800">
//                 Description
//               </label>
//               <textarea
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-lg font-medium text-gray-800">
//                 Author
//               </label>
//               <input
//                 type="text"
//                 value={author}
//                 onChange={(e) => setAuthor(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-lg font-medium text-gray-800">
//                 Language
//               </label>
//               <select
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 <option value="" disabled>
//                   Select Language
//                 </option>
//                 <option value="Malayalam">Malayalam</option>
//                 <option value="English">English</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="block text-lg font-medium text-gray-800">
//                 Price
//               </label>
//               <input
//                 type="number"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 min="0"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-lg font-medium text-gray-800">
//                 Category
//               </label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 <option value="" disabled>
//                   Select Category
//                 </option>
//                 {waw}
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="block text-lg font-medium text-gray-800">
//                 Stock
//               </label>
//               <input
//                 type="number"
//                 value={stock}
//                 onChange={(e) => setStock(e.target.value)}
//                 min="0"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-lg font-medium text-gray-800">
//                 SKU
//               </label>
//               <input
//                 type="text"
//                 value={sku}
//                 onChange={(e) => setSku(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>

//             <div className="flex space-x-4">
//               <div className="flex-1 p-4 text-center">
//                 <img
//                   src={croped ? croped : image[0]}
//                   alt="Image 1"
//                   className="w-full h-auto rounded-lg"
//                 />
//                 <input
//                   type="file"
//                   className="mt-2 p-2 border rounded-md w-full"
//                   onChange={handleFilechange}
//                 />
//               </div>
//               <div className="flex-1 p-4 text-center">
//                 <img
//                   src={croped2 ? croped2 : image[1]}
//                   alt="Image 2"
//                   className="w-full h-auto rounded-lg"
//                 />
//                 <input
//                   type="file"
//                   className="mt-2 p-2 border rounded-md w-full"
//                   onChange={handleFilechange2}
//                 />
//               </div>
//               <div className="flex-1 p-4 text-center">
//                 <img
//                   src={croped3 ? croped3 : image[2]}
//                   alt="Image 3"
//                   className="w-full h-auto rounded-lg"
//                 />
//                 <input
//                   type="file"
//                   className="mt-2 p-2 border rounded-md w-full"
//                   onChange={handleFilechange3}
//                 />
//               </div>
//               <div className="flex-1 p-4 text-center">
//                 <img
//                   src={croped4 ? croped4 : image[3]}
//                   alt="Image 4"
//                   className="w-full h-auto rounded-lg"
//                 />
//                 <input
//                   type="file"
//                   className="mt-2 p-2 border rounded-md w-full"
//                   onChange={handleFilechange4}
//                 />
//               </div>
//             </div>

//             <div>
//               {image1 && <CropImage url1={image1} />}
//               {image2 && <CropImage url2={image2} />}
//               {image3 && <CropImage url3={image3} />}
//               {image4 && <CropImage url4={image4} />}
//             </div>

//             <input
//               type="submit"
//               value="Submit"
//               className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Editproduct;


import  { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import adminInstance from './AdminApi/AdminInstance';
import { useParams, useNavigate } from 'react-router-dom';
import Crop from '@/Reusable/Crop';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '../feature/adminSlice';

function Editproduct() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [language, setLanguage] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [sku, setSku] = useState('');

  const [image, setImage] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const croped = useSelector((state) => state.image.imageurl);
  const croped2 = useSelector((state) => state.image.imageurl2);
  const croped3 = useSelector((state) => state.image.imageurl3);
  const croped4 = useSelector((state) => state.image.imageurl4);

  console.log('what happend here', croped2);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await adminInstance.get('/category');
        console.log(response.data.category);
        setCateList(response.data.categories)
      } catch (error) {
        toast.error('Error fetching category data:');
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    setImage1(null);
  }, [croped]);

  useEffect(() => {
    setImage2(null);
  }, [croped2]);

  useEffect(() => {
    setImage3(null);
  }, [croped3]);

  useEffect(() => {
    setImage4(null);
  }, [croped4]);

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const response = await adminInstance.get(`/product/${id}`); // Assuming `id` is defined
        setProductName(response.data.product.name);
        setDescription(response.data.product.description);
        setAuthor(response.data.product.author);
        setLanguage(response.data.product.language);
        setPrice(response.data.product.price);
        setStock(response.data.product.stock);
        setCategory(response.data.product.categoryId.name);
        setSku(response.data.product.sku);
        setImage(response.data.product.images);
      } catch (error) {
        if(error)
        {
        dispatch(logoutAdmin());
        }
      }
    };
    if (id) {
      getSingleProduct();
    }
  }, [id,dispatch]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!productName || !description || !author || !sku) {
        let emptyFields = [];

        if (!productName) emptyFields.push('Product Name');
        if (!description) emptyFields.push('Description');
        if (!author) emptyFields.push('Author');
        if (!sku) emptyFields.push('SKU');

        toast.error(
          `The following fields are required: ${emptyFields.join(', ')}`
        );
        return;
      }

      if (productName.trim().length === 0) {
        toast.error('Product Name cannot be empty');
        return;
      }

      if (description.trim().length === 0) {
        toast.error('Description cannot be empty');
        return;
      }

      if (author.trim().length === 0) {
        toast.error('Author cannot be empty');
        return;
      }

      if (sku.trim().length === 0) {
        toast.error('SKU cannot be empty');
        return;
      }
      let u1 = image[0];
      let u2 = image[1];
      let u3 = image[2];
      let u4 = image[3];
      if (croped) {
        const formData = new FormData();
        const base64Data = croped.replace(/^data:image\/\w+;base64,/, '');
        const blob = new Blob(
          [Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))],
          {
            type: 'image/jpeg',
          }
        );
        formData.append('file', blob);
        formData.append('upload_preset', 'products');
        const uploadResponse = await axios.post(
          'https://api.cloudinary.com/v1_1/dwerqkqou/image/upload',
          formData
        );
        const imageUrl = uploadResponse.data.secure_url;
        u1 = imageUrl;
      }

      if (croped2) {
        const formData = new FormData();
        const base64Data = croped2.replace(/^data:image\/\w+;base64,/, '');
        const blob = new Blob(
          [Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))],
          {
            type: 'image/jpeg',
          }
        );
        formData.append('file', blob);
        formData.append('upload_preset', 'products');
        const uploadResponse = await axios.post(
          'https://api.cloudinary.com/v1_1/dwerqkqou/image/upload',
          formData
        );
        const imageUrl = uploadResponse.data.secure_url;
        u2 = imageUrl;
      }
      if (croped3) {
        const formData = new FormData();
        const base64Data = croped3.replace(/^data:image\/\w+;base64,/, '');
        const blob = new Blob(
          [Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))],
          {
            type: 'image/jpeg',
          }
        );
        formData.append('file', blob);
        formData.append('upload_preset', 'products');
        const uploadResponse = await axios.post(
          'https://api.cloudinary.com/v1_1/dwerqkqou/image/upload',
          formData
        );
        const imageUrl = uploadResponse.data.secure_url;
        u3 = imageUrl;
      }
      if (croped4) {
        const formData = new FormData();
        const base64Data = croped3.replace(/^data:image\/\w+;base64,/, '');
        const blob = new Blob(
          [Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))],
          {
            type: 'image/jpeg',
          }
        );
        formData.append('file', blob);
        formData.append('upload_preset', 'products');
        const uploadResponse = await axios.post(
          'https://api.cloudinary.com/v1_1/dwerqkqou/image/upload',
          formData
        );
        const imageUrl = uploadResponse.data.secure_url;
        u4 = imageUrl;
      }
      const crop = [u1, u2, u3, u4];
      const formatProductName = productName
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
      console.log(formatProductName);
      const response = await adminInstance.post(`/product/${id}`, {
        formatProductName,
        description,
        author,
        language,
        price,
        category,
        stock,
        sku,
        crop,
      });
      console.log(response);
      if (response.status === 200) {
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.meassage === 'Product already exists') {
        toast.error('Product already exists');
        return;
      }
      if (
        error.response.data.meassage === 'Product with this SKU already exists'
      ) {
        toast.error('Product with this SKU already exists');
        return;
      }
    }
  };

  const waw = cateList.map((doc) => (
    <option key={doc.id} value={doc.name}>
      {doc.name}
    </option>
  ));

  const handleFilechange = (e) => {
    const file = e.target.files[0];
    console.log(URL.createObjectURL(file));
    setImage1(URL.createObjectURL(file));
  };

  const handleFilechange2 = (e) => {
    const file = e.target.files[0];
    console.log(URL.createObjectURL(file));
    setImage2(URL.createObjectURL(file));
  };

  const handleFilechange3 = (e) => {
    const file = e.target.files[0];
    console.log(URL.createObjectURL(file));
    setImage3(URL.createObjectURL(file));
  };

  const handleFilechange4 = (e) => {
    const file = e.target.files[0];
    console.log(URL.createObjectURL(file));
    setImage4(URL.createObjectURL(file));
  };

  return (
    <>
      <Sidebar />
      <div className="bg-gray-200 text-gray-800 rounded-lg shadow-lg">
        <div className="max-w-4xl mx-auto p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Edit product
          </h2>
          <Toaster position="top-center" richColors />
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-800">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-800">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-800">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-800">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select Language
                </option>
                <option value="Malayalam">Malayalam</option>
                <option value="English">English</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-800">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-800">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {waw}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-800">
                Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-800">
                SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1 p-4 text-center">
                <img
                  src={croped ? croped : image[0]}
                  alt="Image 1"
                  className="w-full h-auto rounded-lg"
                />
                <input
                  type="file"
                  className="mt-2 p-2 border rounded-md w-full"
                  onChange={handleFilechange}
                />
              </div>
              <div className="flex-1 p-4 text-center">
                <img
                  src={croped2 ? croped2 : image[1]}
                  alt="Image 2"
                  className="w-full h-auto rounded-lg"
                />
                <input
                  type="file"
                  className="mt-2 p-2 border rounded-md w-full"
                  onChange={handleFilechange2}
                />
              </div>
              <div className="flex-1 p-4 text-center">
                <img
                  src={croped3 ? croped3 : image[2]}
                  alt="Image 3"
                  className="w-full h-auto rounded-lg"
                />
                <input
                  type="file"
                  className="mt-2 p-2 border rounded-md w-full"
                  onChange={handleFilechange3}
                />
              </div>
              <div className="flex-1 p-4 text-center">
                <img
                  src={croped4 ? croped4 : image[3]}
                  alt="Image 4"
                  className="w-full h-auto rounded-lg"
                />
                <input
                  type="file"
                  className="mt-2 p-2 border rounded-md w-full"
                  onChange={handleFilechange4}
                />
              </div>
            </div>

            <div>
              {image1 && <Crop url={image1} />}
              {image2 && <Crop url2={image2} />}
              {image3 && <Crop url3={image3} />}
              {image4 && <Crop url4={image4} />}
            </div>

            <input
              type="submit"
              value="Submit"
              className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default Editproduct;
