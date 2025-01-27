import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'admin',
  initialState: {
    adminInfo: localStorage.getItem('admin-info')
      ? JSON.parse(localStorage.getItem('admin-info'))
      : null,
  },
  reducers: {
    setAdmindetails: (state, action) => {
      state.adminInfo = action.payload; 
      localStorage.setItem('admin-info', JSON.stringify(action.payload));  
    },
    logoutAdmin: (state) => {
      state.adminInfo = null 
      localStorage.removeItem("admin-info");
    },
  },
});

export default counterSlice.reducer;
export const { setAdmindetails ,logoutAdmin} = counterSlice.actions;
