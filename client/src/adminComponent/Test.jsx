import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Test = () => {
  const csvData = [
    ["Name", "Age", "Country"],
    ["Alice", 25, "USA"],
    ["Bob", 30, "UK"],
    ["Charlie", 35, "Canada"]
  ];

  // Dummy values for additional text
  const heading = "Sales Report";
  const orderamount = "$1500";
  const saleCount = 50;
  const allDiscount = "$200";

  // Function to export data as PDF with heading in the first column
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);

    // Add heading to the first column
    const modifiedData = [
      [heading, "", ""], // Heading row with empty columns for alignment
      ...csvData // Add the existing table data below the heading row
    ];

    const headers = modifiedData[0]; // First row as headers
    const rows = modifiedData.slice(1); // Remaining rows as data

    doc.autoTable({
      head: [headers], // headers will be the first row
      body: rows, // data rows
      startY: 20,
      theme: 'striped', // Optional: Add striped style to the table
    });

    const finalY = doc.lastAutoTable.finalY || 20;

    doc.setFontSize(14);
    doc.text(`Total Sale: ${orderamount}`, 14, finalY + 10);
    doc.text(`Total Ordered Products: ${saleCount}`, 14, finalY + 20);
    doc.text(`Total Discount: ${allDiscount}`, 14, finalY + 30);

    doc.save('data.pdf');
  };

  return (
    <div>
      <button onClick={exportToPDF}>Export Data to PDF</button>
    </div>
  );
};

export default Test;
