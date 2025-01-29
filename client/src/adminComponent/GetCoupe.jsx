import React,{useState,useEffect} from 'react'
import Sidebar from './Sidebar'
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Modal from 'react-modal';
import { coupencreation,getAllcopen,coupenDelet } from './AdminApi/Coupen';
import Swal from 'sweetalert2';
import Pagination from '@/Reusable/Pagination';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function GetCoupe() {
  let subtitle;
  
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [copencode,setCopencode]=useState("")
  const [copentype,setCopentype]=useState("")
  const [minimumPurchase,setMinimumPurchase]=useState(null)
  const [discount,setDiscount]=useState(null)
  const [limit,setLimit]=useState(null)
  const [expiryDate, setExpiryDate] = useState('');
  const [coupen,setCoupen]=useState([])
  const [coupadd,setCoupadd]=useState(false)
  useEffect(()=>{
   const getCoupen=async()=>{
      await getAllcopen(setCoupen)
      setCoupadd(false)
   }
   getCoupen()
  },[coupadd])
  
  function openModal() {
    setIsOpen(true);
  }
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = coupen.slice(indexOfFirstItem, indexOfLastItem);
  function afterOpenModal() {
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleDelete=async(id)=>{
     const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this offer? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
          });
      if (result.isConfirmed)
         {
             await coupenDelet(id,setCoupen)
         }
}

  const copenSubmit=async(e)=>{
    try{
   e.preventDefault()
   const selectedDate=new Date(expiryDate)
   if(copencode.length<=2)
   {
    toast.error("copen code should have more than 2 letter")
    return
   }
   if(selectedDate<new Date())
   {
    toast.error("expiry date should be future valure")
    return
   }
   if(copentype==='flat')
   {
    if (Number(discount) > Number(minimumPurchase)) {
      toast.error(`Discount (${discount}) exceeds the minimum purchase amount (${minimumPurchase})`);
      return;
    }
   }
   if(copentype==='percentage')
    {

    if(Number(discount)>100){
     toast.error("Your discount should be in percentage,please fill value between 1 to 100")
     return
    }
    }
   await coupencreation(copencode,copentype,minimumPurchase,discount,limit,selectedDate,toast,setIsOpen,setCoupadd)   
  }
  catch(error)
  {
    console.log(error)
  }
  }
  const coupenItem = currentItems.map((doc, index) => (
    <tr key={index}>
      <td className="border border-gray-500 px-4 py-2">{doc.coupenCode}</td>
      <td className="border border-gray-500 px-4 py-2">{doc.coupenType}</td>
      <td className="border border-gray-500 px-4 py-2">{doc.minimumPurchase}</td>
      <td className="border border-gray-500 px-4 py-2">
        {doc.coupenType === 'percentage' ? `${doc.discountedAmount}%` : doc.discountedAmount}
      </td>
      <td className="border border-gray-500 px-4 py-2">{doc.usageLimit}</td>
      <td className="border border-gray-500 px-4 py-2">{new Date(doc.expiryDate).toISOString().split('T')[0]}</td>
      <td
        className={`border border-gray-500 px-4 py-2 ${
          new Date(doc.expiryDate) > new Date() ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {new Date(doc.expiryDate) > new Date() ? 'Active' : 'Inactive'}
      </td>
      <td className="border border-gray-500 px-4 py-2">
        <button
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
          onClick={() => handleDelete(doc._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <div className="flex h-screen overflow-hidden">
  <Toaster position="top-center" richColors />
  <Sidebar />
  <div className="bg-gray-200">
    <div className="flex-1 ml-64 p-6 overflow-y-auto">
      <h1 className="text-2xl font-extrabold text-black my-6">
        Coupon Management
      </h1>

      <button 
        onClick={openModal} 
        className="bg-blue-600 text-white py-2 px-6 rounded shadow hover:bg-blue-700 transition-all duration-200 mb-6"
      >
        Add coupen
      </button>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add Coupon Modal"
      >
        <div className="p-6 w-[400px]">
          <h2 
            ref={(_subtitle) => (subtitle = _subtitle)} 
            className="text-2xl font-bold text-center text-blue-600 mb-4"
          >
            Add New Coupon
          </h2>
          <br />
          <button 
            onClick={closeModal} 
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
          <form className="space-y-4" onSubmit={copenSubmit}>
      <div>
        <label htmlFor="coupenCode" className="block text-gray-700 font-medium">Coupon Code</label>
        <input 
          type="text" 
          id="coupenCode" 
          name="coupenCode" 
          required 
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          placeholder="Enter coupon code"
          onChange={(e)=>setCopencode(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="coupenType" className="block text-gray-700 font-medium">Coupon Type</label>
        <select 
          id="coupenType" 
          name="coupenType" 
          required 
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
          value={copentype}
          onChange={(e) => setCopentype(e.target.value)} 
        >
          <option value="" disabled>Select coupon type</option>
          <option value="flat">Flat</option>
          <option value="percentage">Percentage</option>
        </select>
      </div>

     
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minimumPurchase" className="block text-gray-700 font-medium">Minimum Purchase</label>
          <input 
            type="number" 
            id="minimumPurchase" 
            name="minimumPurchase" 
            required 
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            placeholder="Enter minimum purchase"
            onChange={(e)=>setMinimumPurchase(e.target.value)}
            min="100"
          />
        </div>
        <div>
          <label htmlFor="discountedAmount" className="block text-gray-700 font-medium">Discounted Amount</label>
          <input 
            type="number" 
            id="discountedAmount" 
            name="discountedAmount" 
            required 
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            placeholder="Enter discounted amount"
            onChange={(e)=>setDiscount(e.target.value)}
            min="1"
          />
        </div>
      </div>

      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="usageLimit" className="block text-gray-700 font-medium">Usage Limit</label>
          <input 
            type="number" 
            id="usageLimit" 
            name="usageLimit" 
            required 
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            placeholder="Enter usage limit"
            onChange={(e)=>setLimit(e.target.value)}
            min="1"
          />
        </div>
        <div>
          <label htmlFor="expiryDate" className="block text-gray-700 font-medium">Expiry Date</label>
          <input 
            type="date" 
            id="expiryDate" 
            name="expiryDate" 
            required 
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
            onChange={(e)=>setExpiryDate(e.target.value)}
          />
        </div>
      </div>

      <div className="text-center">
        <button 
          type="submit" 
          className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300 transition-all"
        >
          Submit
        </button>
      </div>
    </form>
          
        </div>
      </Modal>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-500 px-4 py-2">Coupon Code</th>
            <th className="border border-gray-500 px-4 py-2">Coupon Type</th>
            <th className="border border-gray-500 px-4 py-2">Minimum Purchase</th>
            <th className="border border-gray-500 px-4 py-2">Discount</th>
            <th className="border border-gray-500 px-4 py-2">Usage Limit</th>
            <th className="border border-gray-500 px-4 py-2">Expiry</th>
            <th className="border border-gray-500 px-4 py-2">Status</th>
            <th className="border border-gray-500 px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {coupenItem}
        </tbody>
      </table>
      <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(coupen.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
    </div>
  </div>
</div>
 
  )
}

export default GetCoupe
