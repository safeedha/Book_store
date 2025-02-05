import adminInstance from "./AdminInstance";

export const todayreport = async (start, end, setReport) => {
  try {
    console.log(start,end)
    console.log("hello")
    const response = await adminInstance.get("/today", {
      params: {
        start,  
        end     
      }
    });
    setReport(response.data.order)
    console.log(response.data.order)
  } catch (error) {
    console.error("Error fetching today's report:", error);
  }
};
