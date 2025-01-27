const Coupen=require('../Model/Coupen')

const createCoupen=async(req,res,next)=>{
  try{
    const{copencode,copentype,minimumPurchase,discount,limit,selectedDate}=req.body
    const coupen=await Coupen.findOne({coupenCode:copencode,status:"active"})
    if(coupen)
    {
      return res.status(409).json({message:"This code already exist"})
    }
    const newCoupen=new Coupen({
      coupenCode:copencode,
      coupenType:copentype,
      minimumPurchase:minimumPurchase,
      discountedAmount:discount,
      usageLimit:limit,
      expiryDate:selectedDate

    })
    await newCoupen.save();
    
    return res.status(201).json({ message: "Coupon created successfully", coupon: newCoupen });
  }
  catch(error)
  {
    next(error)
  }
}


const getAllCopen=async(req,res,next)=>{
  try{
       const coupen= await Coupen.find({status:"active"}).sort({
        createdAt:-1
        }) 
    res.status(200).json({message:"sucess",coupen})
  }
  catch(error)
  {
    next(error)
  }
}


const deletCoupen=async(req,res,next)=>{
   try{
     const {id}=req.params
     await Coupen.updateOne({_id:id},{$set:{status:"deactive"}})
     
      const coupenall= await Coupen.find({status:"active"}).sort({
        createdAt:-1
        }) 

   res.status(200).json({message:"sucess",coupen:coupenall})
   }
   catch(error)
   {
    next(error)
   }
}





module.exports={
  createCoupen,
  getAllCopen,
  deletCoupen
}