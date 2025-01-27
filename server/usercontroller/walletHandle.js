const Wallet=require('../Model/Wallet')

const getWalletInform=async(req,res,next)=>{
try
{
    const {id}=req.user
    const wallet=await Wallet.find({user_id:id})
    res.status(200).json({message:"all wallet information get",wallet})
}
catch(error)
{
  next(error)
}
}


const walletMoneyAdd=async(req,res,next)=>{
  try{
    const {id}=req.user
    const {amount}=req.body
    const wallet=await Wallet.findOne({user_id:id})
    if(!wallet)
    {
      const newWallet=new Wallet({
        user_id:id,
        wallet_item:[{
          transactionType:"credit",
          amount:amount
        }]
      })
      await newWallet.save()
      return res.status(201).json({message:"amount added to wallet",newWallet})
    }
    else{
      wallet.wallet_item.unshift({
        transactionType:"credit",
        amount:amount
      })
      await wallet.save()
      console.log(wallet)
      return res.status(201).json({message:"amount added to wallet",wallet})
    }
  }
  catch(error){
    next(error)
  }
}







module.exports={
  getWalletInform,
  walletMoneyAdd
}