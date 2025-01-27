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


export default function Salaesreport() {
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
 

  useEffect(()=>{
    console.log("hey")
  console.log(csvData)
  },[csvData])

  useEffect(()=>{
      const getDefaultreprt=async()=>{
        await todayreport(setDeliverd,setChartData);
      }
      getDefaultreprt()
  },[])


  const [order,setDeliverd]=useState([])
  const [orderamount,setOrderamount]=useState(0)
  const [saleCount,setSaleCount]=useState(0)
  const [allDiscount,setAlldiscount]=useState(0)
  const [heading,setHeading]=useState("")
  useEffect(()=>{
  const orderAmount=order.reduce((accum,curr)=>accum+curr.total_amount,0)
  setOrderamount(orderAmount)
  const count=order.reduce((accum,curr)=>curr.order_item.length+accum,0)
  setSaleCount(count)
  const discount=order.reduce((accum,curr)=>accum+(curr.actual_amount-curr.total_amount),0)
  setAlldiscount(discount)
  },[order])


  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(heading, 14, 15);
    const headers = csvData[0];
    const rows = csvData.slice(1);
  
    const verticalData = headers.map((header, index) => {
      const values = rows.map(row => row[index]).join(', '); // Concatenate values for the header
      return [header, values]; // Each header and its corresponding values
    });
        
    doc.autoTable({
      head: [["Field", "Total amount of product"]], // Column titles
      body: verticalData, // Transformed data
      startY: 20, // Starting Y position for the table
    })

    // doc.autoTable({
    //   head: [headers],
    //   body: rows,
    //   startY: 20,
    // });
  
    const finalY = doc.lastAutoTable.finalY || 20;
  

    doc.setFontSize(14);
    doc.text(`Total sale: ${orderamount}`,14, finalY + 10);
    doc.text(`Total Orderd Product: ${saleCount}`, 14, finalY + 20);
  

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
          text: "Date",
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
      console.log("clicked");
      await todayreport(setDeliverd,setChartData,setHeading,setCsvData);
    } catch (error) {
      console.log(error);
    }
  };

  const weekHandle=async()=>{
    try{
     await weekReport(setDeliverd,setChartData,setHeading,setCsvData)
    }
    catch(error)
    {
      console.log(error)
    }
  }



  const monthHandle=async()=>{
    try{
     await monthReport(setDeliverd,setChartData,setHeading,setCsvData)
    }
    catch(error)
    {
      console.log(error)
    }
  }


  const customHandle = async () => {
    console.log("Start Date: ", startDate);
    console.log("End Date: ", endDate);
 
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
    await customReport(setDeliverd, startDate, endDate,setChartData,setHeading,setCsvData);
  };
  


  


  return (
    <div className="flex">
      <Sidebar />
      <Toaster position="top-center" richColors />
      <div className="ml-64 p-6 flex-1 bg-gray-300 min-h-screen">
        <h2 className="text-xl font-bold mb-4">Sales Report</h2>
        
       
        {/* Display Sales Info Above the Graph */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold">Sales Count</h3>
            <p>{saleCount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold">Total Order Amount</h3>
            <p>${orderamount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold">Overall Discount</h3>
            <p>${allDiscount}</p>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mb-4">
          <button
            onClick={() => todayHandle()}
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Today
          </button>
          <button
            onClick={() =>weekHandle()}
            className="mr-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            Week
          </button>
          <button
            onClick={() => monthHandle("1-month")}
            className="mr-2 px-4 py-2 bg-purple-500 text-white rounded"
          >
            Month
          </button>
        
        </div>
        
        {/* Custom Date Range Picker */}
        <div className="mb-4">
          <label className="mr-4">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <label className="mr-4 ml-4">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <button
            onClick={customHandle}
            className="ml-4 px-4 py-2 bg-gray-700 text-white rounded"
          >
            Apply Range
          </button>

          <button
            onClick={exportToPDF}
            className="ml-4 px-4 py-2 bg-gray-700 text-white rounded"
          >
          Download Pdf
          </button>

          <button
         
            className="ml-4 px-4 py-2 bg-gray-700 text-white rounded"
          >
           <CSVLink data={csvData}>Preview xcel</CSVLink>;
          </button>
        </div>

       
     
        <SalesGraph data={chartData} options={options} />
      </div>
    </div>
  )
  }
