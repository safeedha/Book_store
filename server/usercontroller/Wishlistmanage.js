const Product = require('../Model/Product')
const WishList=require('../Model/Whishlist')
const User=require('../Model/User')

const addToWishlist=async(req,res,next)=>{
  try{
    const {id}=req.user
    const {productId}=req.body
    const user = await User.findById({ _id: id })
    if (user.status==='block') {
        return res.status(403).json({ message: "User blocked" })
    }
    const wishList=await WishList.findOne({userId:id})
    if (!wishList) {     
      const newWishList = new WishList({
        userId:id,
        Products: [{ productId }]
      });
      await newWishList.save(); 
      return res.status(200).json({message:"product added to wishList"})
    }
    else{
       wishList.Products.push({productId })
       await wishList.save();
       return res.status(200).json({message:"product added to wishList"})
    }
  }
      catch(error)
      {
      next(error)
      }
}


const removeFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId } = req.body;

    const user = await User.findById({ _id: id });
    if (user.status === 'block') {
      return res.status(403).json({ message: "User is blocked" });
    }

    const wishList = await WishList.findOne({ userId: id });
    if (!wishList) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishList.Products = wishList.Products.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishList.save();
    const wish=await WishList.findOne({userId:id}).populate("Products.productId")
    const wishedProduct=wish.Products
    return res.status(200).json({ message: "Product removed from wishlist",item:wishedProduct});
  } catch (error) {
    next(error);
  }
};


const getWishListstatus=async(req,res,next)=>{
  try{
    const { productId } = req.params;
    const {id}=req.user
    const user = await User.findById({ _id: id });
    if (user.status === 'block') {
      return res.status(403).json({ message: "User is blocked" });
    }
    const wishList = await WishList.findOne({ userId: id });
    if (!wishList) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    const result = wishList.Products.find(
      (item) => item.productId.toString() === productId
    );
    if(result)
    {
      return res.status(200).json({ message: "Product found in wishList" });
    }
    else{
      return res.status(404).json({ message: "Product not found in wishList" });
    }
  }
  catch(error)
  {
    next(error)
  }
}


const getWishList=async(req,res,next)=>{
  try{
    const {id}=req.user
    const wishList = await WishList.findOne({ userId: id })
    .populate({
      path: "Products.productId",
      populate: {
        path: "offerId",
      },
    })
    .sort({ updatedDate: 1 }); 
    const wishedProduct = wishList.Products.sort(
      (a, b) => new Date(b.addedOn) - new Date(a.addedOn)
    );
    
    res.status(200).json({item:wishedProduct});
  }
  catch(error)
  {
    next(error)

  }
}









module.exports={
  addToWishlist,
  removeFromWishlist,
  getWishListstatus,
  getWishList
  
}