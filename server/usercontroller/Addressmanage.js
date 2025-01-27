const Address=require('../Model/Address')
const { verifyUsertoken }=require('../Middleware/usertokenverify')

const addAddress=async(req,res)=>{
  try{
  const {name,phone,streetAddress,state,district,pincode,city}=req.body
  const {id}=req.user
  const address= await Address.create({name:name,phone:phone,streetAddress:streetAddress,state:state,district:district,pincode:pincode,user_id:id,city:city})
  res.status(201).json({message:"acoount created suceesfully please verify Your mail",address})
  }
  catch(error)
  {
    console.log(error)
  }
}

const fetchAddress=async(req,res,next)=>{
try{
   const{id}=req.user
   const address=await Address.find({user_id:id,status:'unblock'})
   res.status(200).json({message:"address fetched sucessfully",address})
}
catch(error){
  console.log(error)
}
}

const getsingleAddress=async(req,res,next)=>{
  try{
   const { id } = req.params; 
   const address=await Address.findOne({_id:id})
   if(!address)
   {
     return res.status(404).json({message:"Address not found",})
   }
   res.status(200).json({message:"single address data",address})
   
  }
  catch(error)
  {
    next(error)
  } 
}

const updateAddress=async(req,res,next)=>{
  try{
  const { id } = req.params

  const { name, phone, streetAddress, state, district, pincode,city }=req.body
  const update = await Address.updateOne(
    { _id: id },
    { 
      $set: {
        name:name,
        phone:phone,
        streetAddress:streetAddress,
        state:state,
        district:district,
        pincode:pincode,
        city:city 
      }
    }
  )
   if(update. matchedCount===1)
    {
      res.status(200).json({message:"updation sucessfull"})
    }  
  }
  catch(error)
  {
    next(error)
  }
}


const deleteAddress=async(req,res,next)=>{
  try{
   const {add_id}=req.params
   const{id}=req.user
   const update = await Address.updateOne(
    { _id: add_id },
    { 
      $set: {
       status:'block'
      }
    }
  )
  const remains = await Address.find({ user_id:id, status: 'unblock' });
  console.log(remains)
  return res.status(200).json({ message: 'Address deleted successfully' ,remains});
  }
  catch(error){
   next(error)
  }
}



















module.exports={
  addAddress,
  fetchAddress,
  getsingleAddress,
  updateAddress,
  deleteAddress
}