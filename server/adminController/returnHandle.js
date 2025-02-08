const Order=require('../Model/Order')
const Wallet=require("../Model/Wallet")
const Product=require("../Model/Product")
const Category=require("../Model/Category")
const getAllreturnedProduct=async(req,res,next)=>{
  try{
 
    const orders = await Order.aggregate([
      {
        $project: {
          user_id: 1,
          shipping_address: 1,
          total_amount: 1,
          actual_amount: 1,
          filtered_items: {
            $filter: {
              input: "$order_item",
              as: "item",
              cond: { $eq: ["$$item.return_request.is_requested", true] }
            }
          }
        }
      },
      {
        $unwind: "$filtered_items"
      },
      {
        $lookup: {
          from: "products", // Name of the collection containing products
          localField: "filtered_items.product_id", // Field in the `Order` collection
          foreignField: "_id", 
          as: "product_info"
        }
      },
      {
        $unwind: "$product_info"
      },
      {
        $lookup: {
          from: "users", 
          localField: "user_id", 
          foreignField: "_id", 
          as: "user_info"
        }
      },
      {
        $unwind: "$user_info" 
      }
    ]);
    
    res.status(200).json({sucess:true,return:orders})
  }
  catch(error)
  {
     next(error)
  }
}

const getApprove=async(req,res,next)=>{
 try{
     const {orderId,productId,userId}=req.query
     const order=await Order.findById(orderId).populate('coupen_id')
     console.log(order)
     const product=await Product.findById(productId)
     let wallet =await Wallet.findOne({user_id:userId})
     let category=await Category.findById(product.categoryId)
    const required=order.order_item.find((item,index)=>item.product_id.toString()===productId) 
     product.sellingcount=product.sellingcount-required.quantity
     category.sellingcount=category.sellingcount-required.quantity
     await product.save()
     await category.save()
     
     if(!wallet)
     {
        wallet=await Wallet.create({
         user_id:userId
       })
     }
     
      const orderItem=order.order_item
      if(!order.coupen_id)
      {
       
        required.return_request.is_requested=false
        required.return_request.is_approved=true
        required.order_status="Returned",
        required.payment_status="refund"
        let amount=Math.ceil(required.original_price-(required.original_price*required.discount/100))*required.quantity
        order.total_amount=order.total_amount-amount
        order.actual_amount=order.total_amount-amount
        wallet.wallet_item.unshift({transactionType:"credit",amount:amount})
        await order.save()
        await wallet.save()
        }
      else{   
        required.return_request.is_requested=false
        required.return_request.is_approved=true
        required.order_status="Returned"
          required.payment_status="refund"
        let updatedOrderItems = orderItem.filter(
          item =>
            item.product_id.toString() !== productId &&
            item.order_status === 'Delivered' )

           let sumofremaining=updatedOrderItems.reduce((accum,current)=>
           Math.ceil(current.original_price-(current.original_price*current.discount/100))*current.quantity+accum,0)

           if(sumofremaining>=order.coupen_id.minimumPurchase)
            {
                    order.actual_amount=sumofremaining
                    if(order.coupen_id.coupenType==='flat')
                    {
                      order.total_amount=sumofremaining-order.coupen_id.discountedAmount
                    }
                    if(order.coupen_id.coupenType==='discount')
                      {
                        order.total_amount=Math.ceil(sumofremaining-(sumofremaining*order.coupen_id.discountedAmount/100))
                      }
                      let amount=Math.ceil(required.original_price-(required.original_price*required.discount/100))*required.quantity
                      wallet.wallet_item.unshift({transactionType:"credit",amount:amount})
                      await wallet.save()
                      await order.save()
              }
              else {
               
                let amount=Math.ceil(required.original_price-(required.original_price*required.discount/100))*required.quantity      
                if (!order.remaining) {
                  order.remaining = 0; 
                }
              
                if (order.coupen_id.coupenType === 'flat') {
                  let remaining = order.remaining; 
              
                  
                  if (remaining && amount >= remaining) {
                    let value = amount - remaining;
                    wallet.wallet_item.unshift({ transactionType: "credit", amount: value });
                    order.coupen_id = null; 
                    order.remaining = 0; 
                    await wallet.save();
                    
                  }
 
                  if (amount > order.coupen_id.discountedAmount) {
                    let value = amount - order.coupen_id.discountedAmount;
                    order.coupen_id = null
                    wallet.wallet_item.unshift({ transactionType: "credit", amount: value });
                    await wallet.save();
                    await order.save();
                  }
              
                 
                  if (order && order.coupen_id && amount < order.coupen_id.discountedAmount) {
                    let value = Math.abs(amount - order.coupen_id.discountedAmount);
                    order.remaining = value; 
                  }
              

                  order.actual_amount = sumofremaining;
                  order.total_amount = sumofremaining;
                  await order.save();
                }
                else {
               
                  let discount = order.actual_amount - order.total_amount;
                           
                  let remaining = order.remaining;
                  if (remaining && amount >= remaining) {
                    let value = amount - remaining;
                    wallet.wallet_item.unshift({ transactionType: "credit", amount: value });
                    order.coupen_id = null; 
                    order.remaining = 0; 
                    await wallet.save();
                    
                  }
                  
                  if (amount > discount) {
                    let value = amount - discount;
                    wallet.wallet_item.unshift({ transactionType: "credit", amount: value });
                    order.remaining = 0; 
                    order.coupen_id = null;
                    await wallet.save();
                  }
              
                
                  if (amount < discount) {
                    let value = Math.abs(amount - discount);
                    order.remaining = value; 
                  }
              

                  order.actual_amount = sumofremaining;
                  order.total_amount = sumofremaining;
                  await order.save();
                }
              }
              
          

      }
       res.status(200).json({success:true})
 }
 catch(error)
 {
   next(error)
 }
}


const getReject=async(req,res,next)=>{
  try{
    const {orderId,productId,userId}=req.query
    const order=await Order.findById(orderId)
    const orderItem=order.order_item
    const required=orderItem.find((item,index)=>item.product_id.toString()===productId)
    required.return_request.is_requested=false
    required.return_request.is_approved=false
    await order.save()
    res.status(200).json({success:true})
  }
 catch(error)
 {
  next(error)
 }
}




module.exports={
  getAllreturnedProduct,
  getApprove,
  getReject
}

