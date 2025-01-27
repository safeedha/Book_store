

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesGraph = ({ data, options }) => {
  return (
    <div className="p-4 bg-white shadow-lg rounded-md">
      <Bar data={data} options={options} />
    </div>
  );
};

export default SalesGraph;




























const filterCustomData = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const filteredData = salesData.filter(
      (entry) =>
        new Date(entry.date) >= new Date(startDate) && new Date(entry.date) <= new Date(endDate)
    );

    const labels = filteredData.map((entry) => entry.date);
    const data = filteredData.map((entry) => entry.sales);

    setChartData({
      labels,
      datasets: [
        {
          label: `Sales from ${startDate} to ${endDate}`,
          data,
          fill: false,
          backgroundColor: "rgba(153,102,255,0.4)",
          borderColor: "rgba(153,102,255,1)",
        },
      ],
    });
  };










  // const filterData = (range) => {
  //   let labels = [];
  //   let data = [];

  //   if (range === "1-day") {
  //     labels = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];
  //     data = [100]; // Sales data for that specific day
  //   } else if (range === "1-week") {
  //     labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  //     data = [300, 400, 350, 500, 450, 600, 700];
  //   } else if (range === "1-month") {
  //     labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  //     data = [1200, 1500, 1800, 2000];
  //   } else if (range === "custom") {
  //     filterCustomData(); // Apply custom date range filter
  //     return;
  //   }
