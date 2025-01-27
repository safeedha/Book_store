const User=require('../Model/User')
const OtpModel=require('../Model/Otp')
const account=require('./account')
const bcrypt = require('bcrypt');








const forgetPassword = async (req, res,next) => {
  try {
    const { email } = req.body;
    const exist = await User.findOne({ 
      email: email,
      googleId: null,
    });

    if (!exist) {
      return res.status(404).json({ message: "This email is not registered" });
    }
       await account.otpGeneration(email)
    res.status(200).json({message:"email is found"})

  } catch (error) {
    next(error)
  }
};



const Passwordreset=async(req,res,next)=>{
  try{
    const{email,newPassword}=req.body
   
   const passwordHash=await bcrypt.hash(newPassword,10)
    const update=await User.updateOne({
      email: email,
      googleId: null},{$set:{
      password:passwordHash}})
    res.status(200).json({message:"password reseted"})

  }
  catch(error)
  {
   next(error)
  }
}













module.exports={
  forgetPassword,
  Passwordreset
}