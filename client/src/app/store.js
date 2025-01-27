import {configureStore} from '@reduxjs/toolkit'
import adminreduced from '../feature/adminSlice'
import imageReducer from '../feature/imageSlice';
import userReducer from '../feature/userSlice'
import cartReducer from '../feature/cartSlice'

export default configureStore(
  {
    reducer:{
      admin:adminreduced,
      image: imageReducer, 
      user:userReducer,
      cart:cartReducer
    }
  }
)
