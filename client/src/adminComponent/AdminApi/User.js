import adminInstance from './AdminInstance';

export const getUser = async (page,itemsPerPage,setTotalPages,setUser, dispatch,logoutAdmin) => {
  try {
    const response = await adminInstance.get('/customer', {
  params: { page, itemsPerPage }
});
    setUser(response.data.customer);
    setTotalPages(response.data.totalPages)
  } catch (error) {
    if (
      error.response.data.message ===
      'Refresh token not found. Please log in again.'
    ) {
      dispatch(logoutAdmin());
    }
  }
};

export const getPage=async(username,itemperpage,dispatch,logoutAdmin) => {
  try {
     await adminInstance.get(`/customer/page`, {params:{username,itemperpage}});
    
  } catch (error) {
    if (
      error.response.data.message ===
      'Refresh token not found. Please log in again.'
    ) {
      dispatch(logoutAdmin());
    }
  }
};

export const userStatusUpdate = async (id, setUser, status, user,dispatch,logoutAdmin) => {
  try {
    const response = await adminInstance.patch(`/customer/${id}`, { status });
    if (response) {
      console.log(response);
      const updatedUser = user.map((doc) =>
        doc._id === id ? { ...doc, status } : doc
      );
      setUser(updatedUser);
    }
  } catch (error) {
    if (
      error.response.data.message ===
      'Refresh token not found. Please log in again.'
    ) {
      dispatch(logoutAdmin());
    }
  }
};
