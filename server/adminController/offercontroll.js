const Offer = require('../Model/Offer');
const Product = require('../Model/Product');
const Category = require('../Model/Category');
const { updateOne } = require('../Model/Coupen');
const  createcategoryOffer=async(req,res,next)=>{
   try{
      const{catid,name,expiryDate,discount}=req.body
       const exist=await Offer.findOne({offerType_id:catid})
       if(exist)
       {
           exist.offerName=name,
           exist.offerAmount=discount,
           exist.expiryDate=expiryDate,
           await exist.save()
       }
       else
       {
       const newOffer=new Offer({
        offerName:name,
        offerType:"Category",
        offerType_id:catid,
        offerAmount:discount,
        expiryDate:expiryDate
       })
       await newOffer.save()
      }
       const offer=await Offer.findOne({offerType_id:catid})
       const category=await Category.findOne({_id:catid})
       category.offerId=offer._id
       await category.save()
       const product=await Product.find({categoryId:catid}).populate("offerId")
       console.log(product)
      for(let pro of product)
      {
        if(pro.offerId===null)
        {
          pro.offerId=offer._id
          await pro.save()
        }
        else{
           
          let updatedOfferId=pro.offerId.offerAmount>=offer.offerAmount?pro.offerId._id:offer._id
          pro.offerId=updatedOfferId
          await pro.save()

        }
      }

       res.status(201).json({message:"newoffercreated"})
   } 
   catch(error){
     next(error)
   }
}



const  createproductOffer=async(req,res,next)=>{
  try{
     const{productId,name,expiryDate,discount}=req.body
      const exist=await Offer.findOne({offerType_id:productId})
      if(exist)
      {
       exist.offerName=name,
       exist.offerAmount=discount,
       exist.expiryDate=expiryDate
       await exist.save()
      }
      else{
      const newOffer=new Offer({
       offerName:name,
       offerType:"Product",
       offerType_id:productId,
       offerAmount:discount,
       expiryDate:expiryDate
      })
      await newOffer.save()
    }
      const offer=await Offer.findOne({offerType_id:productId})
      const product=await Product.findOne({_id:productId})
      const catId=product.categoryId
      const category=await Category.findOne({_id:catId}).populate("offerId")
      console.log(category)
      if(category.offerId?._id)
      {
        console.log(category.offerId.offerAmount,offer.offerAmount)
        console.log()
        let updatedOfferId=category.offerId.offerAmount>=offer.offerAmount?category.offerId._id:offer._id
        product.offerId=updatedOfferId
        await product.save()
      }
      else{
        product.offerId=offer._id
        await product.save()
      }
      res.status(201).json({message:"newoffercreated"})
  } 
  catch(error){
    next(error)
  }
}



const getActiveoffer=async(req,res,next)=>{
  try{

    const offers = await Offer.find()
      .populate({
        path: "offerType_id", 
        select: "name", 
      })
      res.status(200).json({sucess:true,offer:offers})
  }
  catch(error)
  {
    next(error)
  }
}


const deleteOffer=async(req,res,next)=>{
  try{
    const {offerid}=req.params
    console.log(offerid)
    const offer=await Offer.findById(offerid)
    await Category.updateOne({offerId:offerid},{$set:{offerId:null}})
    await Product.updateMany({offerId:offerid},{$set:{offerId:null}})
   const del=await Offer.deleteOne({_id:offerid})

    const offers = await Offer.find()
    .populate({
      path: "offerType_id", 
      select: "name", 
    })
    res.status(200).json({sucess:true,offer:offers})
  }
  catch(error)
  {
    next(error)
  }
}


module.exports={
  createcategoryOffer,
  createproductOffer,
  getActiveoffer,
  deleteOffer
}