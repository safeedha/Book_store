const Product=require('../Model/Product')
const Category=require('../Model/Category')

const getTopProduct=async(req,res,next)=>{
try{
  console.log("top product")  
    const products = await Product.find({}).sort({sellingcount:-1}).limit(10)
      res.status(200).json({ message: "Products fetched successfully", product: products });
}
catch(error){
  next(error)
}
}


const getTopCategory=async(req,res,next)=>{
  try{
   
      const category = await Category.find({}).sort({sellingcount:-1}).limit(10)
        res.status(200).json({ message: "Products fetched successfully",category: category });
  }
  catch(error){
    next(error)
  }
  }


module.exports={
   getTopProduct,
   getTopCategory

}