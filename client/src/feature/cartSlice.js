import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'cart',
  initialState: {
    quantity: false, 
  },
  reducers: {
    cartQuantityUpdate: (state,action) => {
      state.quantity = action.payload; 
    },
  },
});

export default counterSlice.reducer;
export const { cartQuantityUpdate } = counterSlice.actions;


