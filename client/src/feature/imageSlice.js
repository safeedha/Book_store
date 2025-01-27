import { createSlice } from '@reduxjs/toolkit';


const initialState = {
 imageurl:"",
 imageurl2:"",
 imageurl3:"",
 imageurl4:""
}

const counterSlice = createSlice({
  name: "Image",
  initialState, 
  reducers: {
    imageUrlupdate: (state, action) => {
      state.imageurl = action.payload; 
    },
    imageUrl2update: (state, action) => {
      state.imageurl2 = action.payload; 
    },
    imageUrl3update: (state, action) => {
      state.imageurl3 = action.payload; 
    },
    imageUrl4update: (state, action) => {
      state.imageurl4 = action.payload; 
    }
   
  }
});


export const { imageUrlupdate,imageUrl2update,imageUrl3update,imageUrl4update} = counterSlice.actions;
export default counterSlice.reducer;
