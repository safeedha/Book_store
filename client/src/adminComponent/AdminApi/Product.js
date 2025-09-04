import adminInstance from './AdminInstance';

export const getAllproduct = async (page,rowsPerPage,setTotalPages,setProduct, dispatch, logoutAdmin) => {
  try {
    const response = await adminInstance.get('/product',{params:{page,rowsPerPage}});
    setProduct(response.data.product);
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

export const changeStatus = async (id,status, dispatch, logoutAdmin) => {
  try {
    const response = await adminInstance.patch(`/product/${id}`, { status });
    return response;
  } catch (error) {
    if (
      error.response.data.message ===
      'Refresh token not found. Please log in again.'
    ) {
      dispatch(logoutAdmin());
    }
  }
};

export const addofferProduct = async (
  productId,
  name,
  expiryDate,
  discount,
  setIsOpen,
  toast,
  dispatch,
  logoutAdmin
) => {
  try {
    const response = await adminInstance.post('/offer/product', {
      productId,
      name,
      expiryDate,
      discount,
    });
    if (response.status === 200) {
      toast.success('Exist product offer upadted');
      setIsOpen(false);
    }

    if (response.status === 201) {
      toast.success('Offer created sucessfully');
      setIsOpen(false);
    }
  } catch (error) {
    console.log(error);
    if (error.response.status === 409) {
      toast.error('offer already exist for this product');
      setIsOpen(false);
      return;
    }
    if (
      error.response.data.message ===
      'Refresh token not found. Please log in again.'
    ) {
      dispatch(logoutAdmin());
    }
  }
};
