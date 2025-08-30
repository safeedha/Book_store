import instance from './instance';

export const getAvailableCoupen = async (price, setCoupen) => {
  try {
    const response = await instance.get(`user/coupen/${price}`);
    setCoupen(response.data.coupen);
    console.log(response.data.coupen);
  } catch (error) {
    console.log(error);
  }
};

// export const applycoupen=async(coupenCode,toast)=>{
//   try{

//     const response=await instance.post("user/coupen",{coupenCode})
//     {
//       if(response.status===200)
//       {
//         toast.success("coupen applied")
//       }
//     }
//   }

//   catch(error)
//   {
//    if(error.response.data.message==="You have already applied this coupon, no more uses allowed.")
//    {
//     toast.error(error.response.data.message)
//      return
//    }

//   }
// }

export const coupenStatus = async (coupenCode, toast) => {
  try {
    console.log('hello');
    const response = await instance.post('user/coupen', { coupenCode });
    if (response.status === 200) {
      toast.success('You successfully applied coupen');
      return response;
    }
  } catch (error) {
    if (error.response.status === 400) {
      toast.error('Your limit for applying this coupen expired');
    }
  }
};
