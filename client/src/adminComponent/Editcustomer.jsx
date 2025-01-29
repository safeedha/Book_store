import React,{useEffect, useState} from 'react'
import { useLocation,useParams, useNavigate} from 'react-router-dom'
import { motion } from 'framer-motion';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";



function Editcustomer() {
  const location = useLocation(); 
  const Navigate=useNavigate()
  const { id } = useParams();
  const [error,setError]=useState(true)
  console.log(id)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
  });

  useEffect(() => {
    const getSingleUser = async () => {
      try {
        const response = await adminInstance.get(`/customer/${id}`);
        console.log("Customer Data:", response.data);

        if (response.status === 200) {
          
          setFormData({
            name: response.data.user.name || '',
            email: response.data.user.email || '',
            mobileNo: response.data.user.mobileNo || '',
          });
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    if (id) {
      getSingleUser();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    try{
    e.preventDefault();
    if(formData.name.trim().length===0)
    {
      toast.error("name should not be empty")
       return
    }

    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo)) {
      toast.error("Mobile number should be a 10-digit number");
      return;
    }
    console.log("sented")
    const response=await adminInstance.post(`/customer/${id}`,formData)
    console.log("sucess")
    if(response.status==200)
    {
     Navigate(-1)
    }
  }
  catch(error)
  { 
  
  }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">

          <Toaster position="top-center" richColors />

          <h2 className="text-2xl font-bold mb-6 text-center">Edit user information</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                name="mobileNo"
                id="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
               Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  ); 
}

export default Editcustomer