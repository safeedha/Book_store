import { set } from "lodash";
import adminInstance from "./AdminInstance";


export const todayreport=async(setDeliverd,setChartData,setHeading,setCsvData,setXasis,setHeader)=>{
  try{
  
    const response =await adminInstance.get("/sales/today")
    console.log(response.data.orders)         
    setDeliverd(response.data.orders)
    const netamount = response.data.orders.reduce((acc, item) => {
      return acc + item.total_amount; // Add item.total_amount to the accumulator
    }, 0)
    const actualamount = response.data.orders.reduce((acc, item) => {
      return acc + item.actual_amount; // Add item.total_amount to the accumulator
    }, 0)
    let discount=actualamount-netamount
    const todaysProduct=response.data.orders.map((item,index)=>{
      return item.order_item.map((single,index)=>{
        return single.name
      })
    })
    console.log(todaysProduct)
    let label=[actualamount,discount,netamount]
    setHeading("Todays Report")
    setXasis("Todays sale's Summary")
    setChartData({
      labels: ["Total Sold Amount", "Total Discount", "Net Amount"],
      datasets: [
        {
          label: "Sales Today",
          data: label,
          fill: true,
          backgroundColor: ["rgba(75,192,192,0.4)", "rgba(255,99,132,0.4)", "rgba(54,162,235,0.4)"],
          borderColor: ["rgba(75,192,192,1)", "rgba(255,99,132,1)", "rgba(54,162,235,1)"],
          borderWidth: 1,
        },
      ],
    });
    setHeader([["Total Sold Amount", "Total Discount", "Net Amount"]])
    setCsvData([[actualamount],[discount],[netamount]])

  }
  catch(error)
  {
    console.log(error)
  }
}




export const weekReport=async(setDeliverd,setChartData,setHeading,setCsvData,setHeader,setXasis)=>{
  try{
    const response =await adminInstance.get("/sales/week")
    console.log(response.data.orders)
    const orderItem_time = response.data.orders.map((item, index) => {
      return item.order_item.map((single, index) => {
        const deliveredDate = new Date(single.delivered_date); // Ensure this is a Date object
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return dayNames[deliveredDate.getDay()]; // Get the day name for the delivered date
      });
    });
    
    console.log("week")
    const labelspreprocess=orderItem_time.flat()
    console.log(labelspreprocess)
    
    const orderItem_price = response.data.orders.map((item, index) => {
      return item.order_item.map((single, index) => {
        const singleprice =Math.ceil (single.original_price-(single.original_price*single.discount/100))
        const total=singleprice*single.quantity
        return total;
      })
    })
    const label_before=orderItem_price.flat()
    console.log(label_before)
    
    const quantity = response.data.orders
    .map((item) => item.order_item.map((single) => single.quantity))
    .flat(); 
  console.log(quantity);

  const count = labelspreprocess.reduce((acc, label, index) => {   
    if (acc[label]) {
      acc[label] += quantity[index];
    } else {
      acc[label] = quantity[index];
    }
    return acc;
  }, {})
   
   

    const result = labelspreprocess.reduce((acc, label, index) => {   
      if (acc[label]) {
        acc[label] += label_before[index];
      } else {
        acc[label] = label_before[index];
      }
      return acc;
    }, {})
     const res=Object.keys(result)
    const label=[]
    const labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (let i = 0; i < 7; i++) {
      const dayName = labels[i];
      const value = result[dayName] ? result[dayName] : 0; // Use day names as keys to access `result`
      label.push(value);
    }
   const productCount=[]
    for (let i = 0; i < 7; i++) {
      const dayName = labels[i];
      const value = count[dayName] ? count[dayName] : 0; // Use day names as keys to access `result`
      productCount.push(value)
    }
    console.log(productCount)

    setDeliverd(response.data.orders)
    setChartData({
      labels: labels,
      datasets: [
        {
          label: "sales in this week",
          data:label,
          fill: true,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
        },
      ],
    })
    setXasis("days")
    console.log(label)
    setHeading("This Week Report from sunday to saturday")
    setCsvData([labels,productCount,label])
    setHeader([["Day", "Sales_count","selled amount"]])

  }
  catch(error){
    console.log(error)
  }
}

export const monthReport=async(setDeliverd,setChartData,setHeading,setCsvData,setXasis,setHeader)=>{
  try{
    const response =await adminInstance.get("/sales/month")
    setDeliverd(response.data.orders)
    const orderItem_month = response.data.orders.map((item, index) => {
      return item.order_item.map((single, index) => {
        const deliveredDate = new Date(single.delivered_date); // Ensure this is a Date object
        const monthIndex = deliveredDate.getMonth(); // Get the month index (0-11)
        return monthIndex; 
      });
    });
    
    const labelspreprocess=orderItem_month.flat()
      
    const quantity = response.data.orders
    .map((item) => item.order_item.map((single) => single.quantity))
    .flat(); 

    const count = labelspreprocess.reduce((acc, label, index) => {   
    if (acc[label]) {
      acc[label] += quantity[index];
    } else {
      acc[label] = quantity[index];
    }
    return acc;
  }, {})
   console.log(count)


    const orderItem_price = response.data.orders.map((item, index) => {
      return item.order_item.map((single, index) => {
        const singleprice =Math.ceil (single.original_price-(single.original_price*single.discount/100))
        const total=singleprice*single.quantity
        return total;
      })
    })
    const label_before=orderItem_price.flat()
    const result = labelspreprocess.reduce((acc, label, index) => {   
      if (acc[label]) {
        acc[label] += label_before[index];
      } else {
        acc[label] = label_before[index];
      }
      return acc;
    }, {});
  
    const labels = ["Janu", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Novem", "Decem"];
    const productCount=[]
    for (let i = 0; i < labels.length; i++) {
     
      const value = count[i] ? count[i] : 0; // Use day names as keys to access `result`
      productCount.push(value)
    }

    const label=[]
    
     for(let i=0;i<labels.length;i++)
     {   
       const value=result[i]?result[i]:0
       label.push(value)
     }
    
     setChartData({
      labels: labels,
      datasets: [
        {
          label: "sales in this year by month wise",
          data:label,
          fill: true,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
        },
      ],
    })

    setHeading("Month Report")
    setCsvData([labels,productCount,label])
    setXasis("month")
    setHeader([["Month", "Sales_count","selled amount"]])
    
  }
  catch(error){
    console.log(error)
  }
}

export const customReport = async (setDelivered, startDate, endDate,setChartData,setHeading,setCsvData,setXasis,setHeader) => {
  try {
    console.log(startDate, endDate)
    const response = await adminInstance.get("/sales/custom", {
      params: {
        startDate,
        endDate,
      },
    });
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Format Date Function (without the comma)
    const formatDate = (date) => {
      return date.toDateString(); // Directly gets the format: Tue Jan 21 2025
    };
    
    // Generate Dates Between Start and End
    const getDatesBetween = (start, end) => {
      const dates = [];
      let currentDate = new Date(start);
      while (currentDate <= end) {
        dates.push(formatDate(currentDate)); // Apply formatDate here
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };
    
    const allDatesBetween = getDatesBetween(start, end);
    
 
    const orderItem_date = response.data.orders.map((item) => {
      return item.order_item.map((single) => {
        const deliveredDate = new Date(single.delivered_date).toDateString(); // Consistent date format
        return deliveredDate;
      });
    });
    
    const labels_before = orderItem_date.flat();
    
    const orderItem_price = response.data.orders.map((item) => {
      return item.order_item.map((single) => {
        const singlePrice = Math.ceil(single.original_price - (single.original_price * single.discount / 100));
        const total = singlePrice * single.quantity;
        return total;
      });
    });
    
    const label_before = orderItem_price.flat();
    
    const quantity = response.data.orders
    .map((item) => item.order_item.map((single) => single.quantity))
    .flat(); 
      
    const count = labels_before.reduce((acc, label, index) => {   
      if (acc[label]) {
        acc[label] += quantity[index];
      } else {
        acc[label] = quantity[index];
      }
      return acc;
    }, {})


    const productCount=[]
    for (let i = 0; i < allDatesBetween.length; i++) {
      const date = allDatesBetween[i];
      const value = count[date] ? count[date] : 0; // Use day names as keys to access `result`
      productCount.push(value)
    }
   
    const result = labels_before.reduce((acc, label, index) => {
      if (acc[label]) {
        acc[label] += label_before[index];
      } else {
        acc[label] = label_before[index];
      }
      return acc;
    }, {});
    
   
    
    
    const label = allDatesBetween.map((date) => result[date] || 0);
    
    console.log("Label:", label);
    setChartData({
      labels:allDatesBetween,
      datasets: [
        {
          label: `sales detail from ${startDate} to ${endDate}`,
          data:label,
          fill: true,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
        },
      ],
    })
    setHeader([["Date","total selled count","total selled amount"]])
    setCsvData([allDatesBetween,productCount,label])
    setXasis("Date")
    setDelivered(response.data.orders);
    setHeading("Custom Report")
  } catch (error) {
    console.error("Error fetching custom report:", error);
  }
}




