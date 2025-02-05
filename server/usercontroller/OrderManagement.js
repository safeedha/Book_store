const Order=require('../Model/Order')
const Cart=require('../Model/Cart')
const Product=require('../Model/Product');
const { OrderStatus } = require('../adminController/adminOrder');
const User=require('../Model/User')
const Coupen=require('../Model/Coupen')
const Wallet=require("../Model/Wallet")
const CreateOrder = async (req, res,next) => {
  try {
    const { price, address_id, payment_methods,coupenId,actalprice } = req.body;
    const { id } = req.user; 
   
    const user = await User.findById({ _id: id })
    let wallet =await Wallet.findOne({user_id:id})
   if(payment_methods==='wallet payment')
   {
    wallet.wallet_item.unshift({transactionType:"debit",amount:price})
    await wallet.save()
   }

    if (user.status==='block') {
        return res.status(403).json({ message: "User blocked" })
    }
    const cart = await Cart.find({ user_id: id })
    .populate({
      path: 'product_id',
      populate: {
        path: 'offerId', 
      },
    })
    .populate('user_id');
    
    for (let item of cart) {
      const product = await Product.findById(item.product_id);
      if (product.stock === 0) {
        await Cart.deleteOne({ _id: item._id });
        return res.status(400).json({ message: `${product.name} is out of stock and has been removed from your cart.` });
      }
      if (item.quantity > product.stock) {
        await Cart.updateOne({ _id: item._id }, { $set: { quantity: product.stock } });
        return res.status(400).json({
          message: `Only ${product.stock} units of ${product.name} are available. Your cart has been updated.`,
        });
      }
    }

    if(coupenId){
      const coupen = await Coupen.findOne({ _id: coupenId });  
      const users = coupen.userId;
      const existingUser = users.find(item => item.user.toString() === id);    
      if (existingUser) {
        if (existingUser.count >= coupen.usageLimit) {
          return res.status(400).json({ message: "You have already applied this coupon, no more uses allowed." });
        } else {
          existingUser.count += 1;
          await coupen.save();           
        }
      } else {
        coupen.userId.push({ user: id, count: 1 });
        await coupen.save();    
      }
    }
   
    const orderItems = cart.map(item => {
      let discount = item.product_id.offerId ? item.product_id.offerId.offerAmount : 0;
    
      return {
        product_id: item.product_id,
        original_price: item.product_id.price,
        quantity: item.quantity,
        payment_status: payment_methods === "wallet payment"
                          ? "paid" 
                          : payment_methods === "cash on delivery"
                            ? "unpaid"
                            : "pending", // Default to "unpaid" for other methods
        discount: discount
      };
    });
    

    const order=await Order.create({
      user_id:id,
      shipping_address:address_id,
      payment_methods:payment_methods,
      order_item:orderItems ,
      payment_status:payment_methods==="cash on delivery"?"unpaid":"paid",
      total_amount:price,
      actual_amount:actalprice,
      coupen_id:coupenId?coupenId:null
    })
   
    for (let item of cart) {
      const product = await Product.findById(item.product_id);  
      if (product) {
        const newStock = product.stock - item.quantity;
        const stockStatus = newStock == 0 ? 'out of stock' : 'available';
        await Product.updateOne(
          { _id: item.product_id },
          { $set: { stock: newStock, stockStatus: stockStatus } }
        );
      }
    }  
    await Cart.deleteMany({ user_id: id })
    res.status(201).json({
      message: 'Order created successfully',orderId:order._id
 
    })
  }
    catch(error)
    {
      next(error)
    }

  }








    




const getOrder = async (req, res,next) => {
  try {
    const { id } = req.user; 
    const order = await Order.find({ user_id: id })
  .populate({
    path: 'order_item.product_id',
    select: 'name images'
  })
  .populate('shipping_address').populate('coupen_id')
  .sort({ createdAt: -1 }); 

    res.status(200).json({ success: true, original: order });
  } catch (error) {
    next(error)
  }
};




const cancelOrder = async (req, res,next) => {
  try {
      const { orderid } = req.params;
      const { id } = req.user;
      const { productId } = req.body;


      const order=await Order.findOne({_id:orderid}).populate(`coupen_id`) 
      const orderItem = order.order_item.find(item => item.product_id.toString() === productId);
   
      const quantityToReturn = orderItem ? orderItem.quantity : 0;
    
      const result = await Order.updateOne(
        { _id: orderid, "order_item.product_id": productId },
        {
          $set: {
            "order_item.$.order_status": "Cancelled",
          },
        }
      );
      const product = await Product.findById(productId)
      const newStock=product.stock + quantityToReturn;
      await Product.updateOne({_id:productId},{$set:{stock:newStock,stockStatus:'available'}})
      
      let wallet =await Wallet.findOne({user_id:id})
      if(!wallet)
      {
         wallet=await Wallet.create({
          user_id:id
        })
      }
      const walletarray=wallet.wallet_item
      
        if(order.payment_methods==="online payment" && !order.coupen_id)
        {
          const hasPendingOrFailed = order.order_item.some(
            (item) => item.payment_status === "pending" || item.payment_status === "failed"
          );
            amount=Math.ceil(orderItem.original_price-(orderItem.original_price*orderItem.discount/100))*orderItem.quantity
            let newprice=order.total_amount-amount
          if (hasPendingOrFailed) {
            const result = await Order.updateOne(
              { _id: orderid, "order_item.product_id": productId },
              {
                $set: {
                  "order_item.$.payment_status": "unpaid",
                  total_amount: newprice,
                  actual_amount:newprice
                },
              }
            )

            const Allorder = await Order.find({ user_id: id })
            .populate({
              path: 'order_item.product_id',
              select: 'name images'
            })
            .populate('shipping_address')
            .sort({ createdAt: -1 }); 
            res.status(200).json({ success: true, original: Allorder });

          }
        }
      
        if(order.payment_methods==="online payment" && order.coupen_id)
          {
            const hasPendingOrFailed = order.order_item.some(
              (item) => item.payment_status === "pending" || item.payment_status === "failed"
            );
                        
            if (hasPendingOrFailed) {
              let updatedOrderItems = order.order_item.filter(
                item =>
                  item.product_id.toString() !== productId &&
                  item.order_status !== 'Cancelled' 
              )
              let sumofremaining=updatedOrderItems.reduce((accum,current)=>
                Math.ceil(current.original_price-(current.original_price*discount/100))*current.quantity+accum,0
               )
               if(sumofremaining>=order.coupen_id.minimumPurchase){
                order.actual_amount=sumofremaining
                if(order.coupen_id.coupenType==='flat')
                {
                  order.total_amount=sumofremaining-order.coupen_id.discountedAmount
                }
                if(order.coupen_id.coupenType==='discount')
                  {
                    order.total_amount=Math.ceil(sumofremaining-(sumofremaining*order.coupen_id.discountedAmount/100))
                  }
                  amount=Math.ceil(orderItem.original_price-(orderItem.original_price*orderItem.discount/100))*orderItem.quantity
                  await order.save()
               }
               else{
                let amount = Math.ceil(orderItem.original_price - (orderItem.original_price * orderItem.discount / 100)) * orderItem.quantity;
                     
                if (!order.remaining) {
                  order.remaining = 0; 
                }
                let remaining = order.remaining; 
                if (order.coupen_id.coupenType === 'flat') {
                               
                  if (remaining && amount >= remaining) {
                    let value = amount - remaining;
                    order.coupen_id = null; 
                    order.remaining = 0; 
                    
                  }
      
                  if (amount > order.coupen_id.discountedAmount) {
                    let value = amount - order.coupen_id.discountedAmount;
                    order.coupen_id = null                                  
                    await order.save();
                  }
              
                 
                  if (amount < order.coupen_id.discountedAmount) {
                    let value = Math.abs(amount - order.coupen_id.discountedAmount);
                    order.remaining = value; 
                  }
              
      
                  order.actual_amount = sumofremaining;
                  order.total_amount = sumofremaining;
                  await order.save();
                }
                else {
               
                  let discount = order.actual_amount - order.total_amount;
                   
                    if (!order.remaining) {
                      order.remaining = 0; 
                    }
                    let remaining = order.remaining; 
                  if (remaining && amount >= remaining) {
                    let value = amount - remaining;
                    order.coupen_id = null; 
                    order.remaining = 0; 
                    
                  }
                  
                  if (amount > discount) {
                    let value = amount - order.coupen_id.discountedAmount;
                    order.remaining = 0; 
                    order.coupen_id = null;
          
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
  
              const Allorder = await Order.find({ user_id: id })
              .populate({
                path: 'order_item.product_id',
                select: 'name images'
              })
              .populate('shipping_address')
              .sort({ createdAt: -1 }); 
              res.status(200).json({ success: true, original: Allorder });
  
            }
          }




      



         if ((order.payment_methods === "online payment" || order.payment_methods === "wallet payment") && order.coupen_id) 
         {
        let updatedOrderItems = order.order_item.filter(
          item =>
            item.product_id.toString() !== productId &&
            item.order_status !== 'Cancelled' 
        )
        let sumofremaining=updatedOrderItems.reduce((accum,current)=>
          Math.ceil(current.original_price-(current.original_price*discount/100))*current.quantity+accum,0
         )
         if(sumofremaining>=order.coupen_id.minimumPurchase){
          order.actual_amount=sumofremaining
          if(order.coupen_id.coupenType==='flat')
          {
            order.total_amount=sumofremaining-order.coupen_id.discountedAmount
          }
          if(order.coupen_id.coupenType==='discount')
            {
              order.total_amount=Math.ceil(sumofremaining-(sumofremaining*order.coupen_id.discountedAmount/100))
            }
            amount=Math.ceil(orderItem.original_price-(orderItem.original_price*orderItem.discount/100))*orderItem.quantity
             walletarray.unshift({transactionType:"credit",amount:amount})
            await wallet.save()
            await order.save()
         }
         else{
          let amount = Math.ceil(orderItem.original_price - (orderItem.original_price * orderItem.discount / 100)) * orderItem.quantity;
               
          if (!order.remaining) {
            order.remaining = 0; 
          }
          let remaining = order.remaining; 
          if (order.coupen_id.coupenType === 'flat') {
                         
            if (remaining && amount >= remaining) {
              let value = amount - remaining;
              walletarray.unshift({ transactionType: "credit", amount: value });
              order.coupen_id = null; 
              order.remaining = 0; 
              await wallet.save();
              
            }

            if (amount > order.coupen_id.discountedAmount) {
              let value = amount - order.coupen_id.discountedAmount;
              order.coupen_id = null
              walletarray.unshift({ transactionType: "credit", amount: value });
              await wallet.save();
              await order.save();
            }
        
           
            if (amount < order.coupen_id.discountedAmount) {
              let value = Math.abs(amount - order.coupen_id.discountedAmount);
              order.remaining = value; 
            }
        

            order.actual_amount = sumofremaining;
            order.total_amount = sumofremaining;
            await order.save();
          }
          else {
         
            let discount = order.actual_amount - order.total_amount;
             
              if (!order.remaining) {
                order.remaining = 0; 
              }
              let remaining = order.remaining; 
            if (remaining && amount >= remaining) {
              let value = amount - remaining;
              walletarray.unshift({ transactionType: "credit", amount: value });
              order.coupen_id = null; 
              order.remaining = 0; 
              await wallet.save();
              
            }
            
            if (amount > discount) {
              let value = amount - order.coupen_id.discountedAmount;
              walletarray.unshift({ transactionType: "credit", amount: value });
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
    




      if(order.payment_methods==="online payment"||order.payment_methods==="wallet payment" &&!order.coupen_id)
      {  
        if(order.total_amount===order.actual_amount)
        {
          let amount=Math.ceil(orderItem.original_price-(orderItem.original_price*orderItem.discount/100))*orderItem.quantity
          let newprice=order.total_amount-amount
               await Order.updateOne(
                          { _id: orderid, "order_item.product_id": productId },
                          {
                            $set: {
                              "order_item.$.payment_status": "refund",
                              total_amount: newprice,
                              actual_amount:newprice
                            },
                          })
          
          walletarray.unshift({transactionType:"credit",amount:amount})
          await wallet.save()
        }
      }


       

      if(order.payment_methods==="cash on delivery"&& !order.coupen_id )
        {
          if(order.total_amount===order.actual_amount){
          let amount=Math.ceil(orderItem.original_price-(orderItem.original_price*orderItem.discount/100))*orderItem.quantity
          let newprice=order.total_amount-amount
                         await Order.updateOne({ _id: orderid, "order_item.product_id":productId },
                                                {
                                                  $set: {
                                                    total_amount: newprice,
                                                    actual_amount:newprice
                                                  },
                                                })
        }
      }


   
        if(order.payment_methods==="cash on delivery" && order.coupen_id)
        {
          let updatedOrderItems = order.order_item.filter(
            item =>
              item.product_id.toString() !== productId &&
              item.order_status !== 'Cancelled' 

          )
          let sumofremaining=updatedOrderItems.reduce((accum,current)=>
            Math.ceil(current.original_price-(current.original_price*discount/100))*current.quantity+accum,0
           )
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
               
               await order.save()
           }
           else{            
            order.actual_amount=sumofremaining
            order.total_amount=sumofremaining
            order.coupen_id=null
            await order.save()
        }  

        }





      
      const Allorder = await Order.find({ user_id: id })
      .populate({
        path: 'order_item.product_id',
        select: 'name images'
      })
      .populate('shipping_address')
      .sort({ createdAt: -1 }); 
      res.status(200).json({ success: true, original: Allorder });
     
  } catch (error) {
     next(error)
  }
};


const getSingleOrderdetail=async(req,res,next)=>{
  try{
    
       const {orderid,productId}=req.params
      
       const order = await Order.findById(orderid)
       .populate({
         path: 'order_item.product_id', 
         select: 'name images ', 
       })
       .populate('shipping_address');
       const date = new Date(order.createdAt)
       const formattedDate = date.toISOString().split('T')[0]
    const productDetails = order.order_item.find(
      (item) => item._id.toString() === productId
    );
      
   const response={
     date:formattedDate,
     productname:productDetails.product_id.name,
     image:productDetails.product_id.images[0],
     quantity:productDetails.quantity,
     originalprice:productDetails.original_price,
     discount:productDetails.discount,
     OrderStatus:productDetails.order_status,
     PaymentMethod:order.payment_methods,
     paymentStatus:productDetails.payment_status,
     shippingname:order.shipping_address.name,
     shippingnumber:order.shipping_address.phone,
     shippingstreetAddress:order.shipping_address.streetAddress,
     shippingstate:order.shipping_address.state,
     shippingdistrict:order.shipping_address.district,
     shippingcity:order.shipping_address.city,
     shippingpincode:order.shipping_address.pincode,

   }
   return res.status(200).json({
    message: "Order details retrieved successfully",
    data: response,
  });
  
  }
  catch(error){
    next(error)
  }
}

const paymentStatus = async (req, res, next) => {
  try {
    const { status, orderId } = req.body;   
    const order = await Order.findById(orderId);
    console.log(order);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const updatedOrderItems = order.order_item.map(item => {
    const itemStatus = item.order_status === "Cancelled" ? "unpaid" : status;
      return {
        ...item,
        payment_status: itemStatus,
      };
    });
    order.order_item = updatedOrderItems;

    await order.save();

    return res.status(200).json({ message: 'Payment status updated successfully' });
  } catch (error) {
    next(error);
  }
};


const relatedProduct=async(req,res,next)=>{
  try{
    const {orderid,productId}=req.params
    const order = await Order.findById(orderid)
       .populate({
         path: 'order_item.product_id', 
         select: 'name images ', 
       })
       const productDetails = order.order_item.filter(
        (item) => item._id.toString() !== productId
      );
    res.status(200).json({message:"related order",related:productDetails})
  }
  catch(error)
  {
    next(error)
  }
}




module.exports={
CreateOrder,
getOrder,
cancelOrder,
getSingleOrderdetail,
paymentStatus,
relatedProduct

}