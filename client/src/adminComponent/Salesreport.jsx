import  { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Swal from 'sweetalert2';
import { startOfDay, endOfDay } from 'date-fns';
import { todayreport } from './AdminApi/Sales';
import { Toaster } from '@/components/ui/sonner';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function Salesreport() {
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState('Today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  useEffect(() => {
    const fetchTodayReport = async () => {
      try {
        if (dateRange === 'Today') {
          const date = new Date();
          const start = startOfDay(date);
          const end = endOfDay(date);
         await todayreport(start, end, setReportData);
        }
      } catch (error) {
        console.error("Error fetching today's report:", error);
      }
    };

    fetchTodayReport();
  }, [dateRange]);

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
    if (e.target.value === 'Today') {
      setStartDate('');
      setEndDate('');
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const Apply = async () => {
    try {
      if (new Date(endDate) < new Date(startDate)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Date Range',
          text: 'End date cannot be earlier than start date.',
          confirmButtonText: 'OK',
        });
        return;
      }
      const start = startOfDay(new Date(startDate));
      const end = endOfDay(new Date(endDate));
      await todayreport(start, end, setReportData);
    } catch (error) {
      console.log(error);
    }
  };
  const tbody = reportData.map((item, index) => (
    <tr key={index} className="odd:bg-gray-100 even:bg-white border-b">
      <td className="px-6 py-3 border">{item._id}</td>
      <td className="px-6 py-3 border">{item.user_details[0].name}</td>
      <td className="px-6 py-3 border">
        {item.product_details.map((prod, idx) => {
          // Find the matching order item to get quantity
          const orderItem = item.order_items.find(
            (order) => order.product_id === prod._id
          );

          return (
            <span key={idx} className="block">
              {prod.name} ({orderItem?.quantity || 0})
              <sapn className="text-red-500">
                {' '}
                &#8377;
                {Math.ceil(
                  orderItem.original_price -
                    orderItem.original_price * orderItem.discount
                )}
                /-
              </sapn>{' '}
              {/* Show quantity */}
            </span>
          );
        })}
      </td>
      <td className="px-6 py-3 border">{item.actual_amount + 50}</td>
      <td className="px-6 py-3 border">
        {item.actual_amount - item.total_amount}
      </td>
      <td className="px-6 py-3 border">{item.total_amount + 50}</td>
    </tr>
  ));

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Sales Report', 14, 15);

    // Define table headers
    const headers = [
      [
        'Order ID',
        'Customer',
        'Products Details',
        'Total Price',
        'Discount',
        'Net Revenue',
      ],
    ];

    const tableData = reportData.map((item) => [
      item._id,
      item.user_details[0].name,
      item.product_details
        .map((prod) => {
          const orderItem = item.order_items.find(
            (order) => order.product_id === prod._id
          );
          const priceWithDiscount = Math.ceil(
            orderItem.original_price -
              orderItem.original_price * orderItem.discount
          );

          // Constructing the text without changing the color
          return `${prod.name} (${orderItem?.quantity || 0}) ${priceWithDiscount}ppu`;
        })
        .join('\n'),
      item.actual_amount + 50,
      item.actual_amount - item.total_amount,
      item.total_amount + 50,
    ]);

    doc.autoTable({
      head: headers,
      body: tableData,
      startY: 20,
      theme: 'striped',
    });

    const finalY = doc.lastAutoTable.finalY || 20;

    const orderAmount = reportData.reduce(
      (acc, item) => acc + (item.actual_amount + 50),
      0
    );
    // const saleCount = reportData.reduce((acc, item) => acc + item.product_details.length, 0);
    const allDiscount = reportData.reduce(
      (acc, item) => acc + (item.actual_amount - item.total_amount),
      0
    );
    const netAmount = reportData.reduce(
      (acc, item) => acc + (item.total_amount + 50),
      0
    );
    // const saleCount = reportData.map(( item,index) =>  item.order_items.reduce((accu,sale)=>accu+sale.quantity,0))
    const saleCount = reportData
      .map((item) =>
        item.order_items.reduce((accu, sale) => accu + sale.quantity, 0)
      )
      .reduce((accu, count) => accu + count, 0);

    doc.setFontSize(12);

    doc.line(14, finalY + 5, 190, finalY + 5);

    doc.text(`Total Sales Amount: ${orderAmount}`, 14, finalY + 15);
    doc.text(`Total Ordered Products: ${saleCount}`, 14, finalY + 25);
    doc.text(`Total Discount: ${allDiscount}`, 14, finalY + 35);
    doc.text(`Total Net Amount: ${netAmount}`, 14, finalY + 45);

    doc.rect(12, finalY + 10, 180, 40);

    doc.save('data.pdf');
  };

  return (
    <div className="flex flex-col">
      <Sidebar />
      <Toaster position="top-center" richColors />

      <div className="ml-64 mt-5 flex items-center space-x-4">
        {/* Date Range Selector */}
        <select
          onChange={handleDateRangeChange}
          value={dateRange}
          className="border-2 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        >
          <option value="Today">Today</option>
          <option value="Custom range">Custom range</option>
        </select>

        {dateRange === 'Custom range' && (
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="border-2 border-gray-300 rounded-md px-4 py-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="border-2 border-gray-300 rounded-md px-4 py-2"
            />
            <button
              className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-400 active:bg-green-600 focus:outline-none transition duration-300 ease-in-out"
              onClick={Apply}
            >
              Apply
            </button>
          </div>
        )}

        <button
          className="ml-auto bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-400 active:bg-blue-600 focus:outline-none transition duration-300 ease-in-out"
          onClick={exportToPDF}
        >
          Export PDF
        </button>
      </div>

      {reportData.length === 0 && dateRange === 'Today' && (
        <div className="flex flex-col items-center justify-center mt-28 p-6  ">
          <p className="text-lg font-semibold text-gray-600">
            No sales recorded today
          </p>
        </div>
      )}

      {reportData.length === 0 && dateRange === 'Custom range' && (
        <div className="flex flex-col items-center justify-center mt-28 p-6  ">
          <p className="text-lg font-semibold text-gray-600">
            No sales recorded from {startDate} to {endDate}{' '}
          </p>
        </div>
      )}

      {reportData.length > 0 && (
        <div className="ml-48 mt-4  bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-700 text-white text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left border">Order ID</th>
                <th className="px-6 py-3 text-left border">Customer</th>
                <th className="px-6 py-3 text-left border">Products Details</th>
                <th className="px-6 py-3 text-left border">Total price</th>
                <th className="px-6 py-3 text-left border">Discount</th>
                <th className="px-6 py-3 text-left border">Net Revenue</th>
              </tr>
            </thead>
            <tbody>{tbody}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
