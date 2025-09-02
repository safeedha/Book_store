import adminInstance from './AdminInstance';

export const getOrder = async (currentPage,rowsPerPage) => {
  try {
    const response = await adminInstance('/order',{params:{currentPage,rowsPerPage}});
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const OrderStatus = async (orderId, prodId, newStatus) => {
  try {
    console.log(prodId, newStatus, orderId);
    const response = await adminInstance.patch(`/order/${orderId}/${prodId}`, {
      newStatus,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getSingleOrderdetail = async (itemId, prodId) => {
  try {
    console.log(itemId, prodId);
    const response = await adminInstance.get(
      `/order/${itemId}/product/${prodId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
