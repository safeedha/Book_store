const Coupen=require('../Model/Coupen')

const getAllcoupen = async (req, res, next) => {
  try {
    const { price } = req.params;


    const numericPrice = parseFloat(price);

    if (isNaN(numericPrice)) {
      return res.status(400).json({ message: "Invalid price parameter. Please provide a valid number." });
    }

    const coupons = await Coupen.find({
      minimumPurchase: { $lte: numericPrice },
      expiryDate: { $gt: new Date() },
      status: "active",
    });

   
    res.status(200).json({ success: true, coupen:coupons });
  } catch (error) {
    next(error);
  }
};


const applyCoupen = async (req, res, next) => {
  try {
    const { coupenCode } = req.body;
    const { id } = req.user;
    console.log(coupenCode)
    const coupen = await Coupen.findOne({ coupenCode: coupenCode ,status:"active"});
    if (!coupen) {
      return res.status(404).json({ message: "Coupon not found" });
    }
   console.log(coupen)
    const users = coupen.userId;

    const existingUser = users.find(item => item.user.toString() === id);
    if (existingUser) {
      if(existingUser.count>=coupen.usageLimit)
      {
        return res.status(400).json({message:"Your Limit expired"})
      }
      else{
       
        return res.status(200).json({message:"Your Applied coupen"})
      }
    }
    else{
      
      return res.status(200).json({message:"coupen applied suceesfully"})
    }
    
 
  } 
  
  catch (error) {
    console.log(error)
    next(error);
  }
};










module.exports={
getAllcoupen,
applyCoupen
}
