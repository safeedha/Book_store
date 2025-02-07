import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SalesGraph from "./SalesGraph";
import { todayreport,weekReport,monthReport,customReport} from "./AdminApi/salesHandle";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"; 
import * as XLSX from "xlsx";
import { CSVDownload,CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../feature/adminSlice";


export default function Dashbord() {
  const dispatch=useDispatch()
  const [chartData, setChartData] = useState({
    labels: ["Jan 1", "Jan 2", "Jan 3", "Jan 4", "Jan 5", "Jan 6"],
    datasets: [
      {
        label: "Sales in 2024",
        data: [100, 200, 150, 300, 250, 400],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  });
   const[csvData,setCsvData]=useState([])
  const [order,setDeliverd]=useState([])
  const [orderamount,setOrderamount]=useState(0)
  const [saleCount,setSaleCount]=useState(0)
  const [allDiscount,setAlldiscount]=useState(0)
  const [heading,setHeading]=useState("")
  const [header, setHeader] = useState([[]])
  const [netamount, setNetamount] = useState(0)
  const [xaxis,setXasis]=useState("")
  const [report,setReport]=useState("Today's Sales")

 

  useEffect(()=>{
      const getDefaultreprt=async()=>{
        await todayreport(setDeliverd,setChartData,setHeading,setCsvData,setXasis,setHeader,dispatch,logoutAdmin);
      }
      getDefaultreprt()
  },[])


  
  useEffect(() => {
    const orderAmount = order.reduce((accum, curr) => accum + (curr.actual_amount+50), 0);
    setOrderamount(orderAmount);
    const orderNet = order.reduce((accum, curr) => accum + (curr.total_amount+50), 0);
    setNetamount(orderNet);
    const quantity = order
    .map((item) => item.order_item.map((single) => single.quantity))
    .flat();
    const saleCount = quantity.reduce((accum, curr) => accum + curr, 0);  
     setSaleCount(saleCount)

    const discount = order.reduce((accum, curr) => accum + (curr.actual_amount - curr.total_amount), 0);
    setAlldiscount(discount);
  }, [order]);
  

  const exportToPDF = () => {
    const transformedData = csvData[0].map((_, index) =>
      header[0].map((_, colIndex) => csvData[colIndex][index])
    )
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(heading, 14, 15);
  
    doc.autoTable({
      head: header, 
      body: transformedData, 
      startY: 20,
      theme: 'striped',
    });
  
    const finalY = doc.lastAutoTable.finalY || 20;
  
    doc.setFontSize(14);
    doc.text(`Total Saled amount: ${orderamount}`, 14, finalY + 10);
    doc.text(`Total Ordered Products: ${saleCount}`, 14, finalY + 20);
    doc.text(`Total Discount: ${allDiscount}`, 14, finalY + 30);
    doc.text(`Total Net amount: ${netamount}`, 14, finalY + 40);
    doc.save('data.pdf');
  };
  



  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Sales Report ",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xaxis,
        },
      },
      y: {
        title: {
          display: true,
          text: "Sales (in USD)",
        },
        beginAtZero: true,
      },
    },
  };






  const todayHandle = async () => {
    try {
      setReport("Today's sales")
      await todayreport(setDeliverd,setChartData,setHeading,setCsvData,setXasis,setHeader,dispatch,logoutAdmin);
    } catch (error) {
      console.log(error);
    }
  };

  const weekHandle=async()=>{
    try{
      setReport("Weekly  sales")
     await weekReport(setDeliverd,setChartData,setHeading,setCsvData,setHeader,setXasis,dispatch,logoutAdmin)
    }
    catch(error)
    {
      console.log(error)
    }
  }



  const monthHandle=async()=>{
    try{
      setReport("Monthly  sales")
     await monthReport(setDeliverd,setChartData,setHeading,setCsvData,setXasis,setHeader,dispatch,logoutAdmin)
    }
    catch(error)
    {
      console.log(error)
    }
  }


  const customHandle = async () => {
 
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }
  
    const currentDate = new Date().toISOString().split("T")[0]; 
    if (endDate > currentDate) {
      toast.error("End date cannot be greater than today's date.");
      return;
    }
    if (endDate <= startDate) {
      toast.error("End date should be greater than start date.");
      return;
    }
    setReport(` sales from ${startDate} to ${endDate}`)
    await customReport(setDeliverd, startDate, endDate,setChartData,setHeading,setCsvData,setXasis,setHeader,dispatch,logoutAdmin);
  };
  


  


  return (
    <div className="flex">
      <Sidebar />
      <Toaster position="top-center" richColors />
      <div className="ml-48 p-2 flex-1 bg-gray-300 min-h-screen w-full">
        <h2 className="text-xl font-bold mb-4">{report}</h2>
        
       
      
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold">Sales Count</h3>
            <p>{saleCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold">Total Order Amount</h3>
            <p>&#8377;{orderamount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold">Overall Discount</h3>
            <p>&#8377;{allDiscount}</p>
          </div>
        </div>

     
        <div className="mb-4">
  <button onClick={() => todayHandle()} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">Today</button>
  <button onClick={() => weekHandle()} className="mr-2 px-4 py-2 bg-green-500 text-white rounded">Week</button>
  <button onClick={() => monthHandle("1-month")} className="mr-2 px-4 py-2 bg-purple-500 text-white rounded">Month</button>
  <label className="ml-4 mr-2">Start Date:</label>
  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-4 py-2 border rounded" />
  <label className="ml-4 mr-2">End Date:</label>
  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-4 py-2 border rounded" />
  <button onClick={customHandle} className="ml-4 px-4 py-2 bg-gray-700 text-white rounded">Apply Range</button>
  <button onClick={exportToPDF} className="ml-4 px-4 py-2 bg-gray-700 text-white rounded">Download Pdf</button>
  {/* <button className="ml-4 px-4 py-2 bg-gray-700 text-white rounded"><CSVLink data={csvData}>Preview Excel</CSVLink></button> */}
</div>


       
     
        <SalesGraph data={chartData} options={options} />
      </div>
    </div>
  )
  }
