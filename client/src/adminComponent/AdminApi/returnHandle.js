import adminInstance from './AdminInstance';

export const returnedProduct = async (setReturned) => {
  try {
    const response = await adminInstance.get('/return');
    setReturned(response.data.return);
    console.log(response.data.return);
  } catch (error) {
    console.log(error);
  }
};

export const approveProduct = async (
  orderid,
  productid,
  userid,
  toast,
  setActive
) => {
  try {
    console.log(orderid, productid, userid);
    const response = await adminInstance.patch('/return/approve', null, {
      params: {
        orderId: orderid,
        productId: productid,
        userId: userid,
      },
    });

    if (response) {
      toast.success(
        "Product return processed successfully. The refund has been credited to the customer's wallet."
      );
      setStatus((prevStatus) => !prevStatus);
    }
  } catch (error) {
    console.error(error);
  }
};

export const rejectProduct = async (
  orderid,
  productid,
  userid,
  toast,
  setActive
) => {
  try {
    const response = await adminInstance.patch('/return/reject', null, {
      params: {
        orderId: orderid,
        productId: productid,
        userId: userid,
      },
    });

    if (response) {
      toast.success('product return request rejected');
      setStatus((prevStatus) => !prevStatus);
    }
  } catch (error) {
    console.error(error);
  }
};
