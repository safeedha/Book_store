import instance from './instance';
export const fetchNewProduct = async () => {
  try {
    const response = await instance.get('user/product/newarrival');
    return response;
  } catch (error) {
    console.error('Error fetching new products:', error);
  }
};

export const fetchCategory = async () => {
  try {
    const response = await instance.get('user/category');
    return response;
  } catch (error) {
    throw error;
  }
};

export const productInformation = async (
  id,
  setProductName,
  setDescription,
  setAuthor,
  setLanguage,
  setPrice,
  setStock,
  setOpt,
  set_Id,
  setSku,
  setImage,
  setActiveImage,
  toast,
  setOffer
) => {
  try {
    const response = await instance.get(`user/product/${id}`);
    console.log(response.data.product);
    setProductName(response.data.product.name);
    setDescription(response.data.product.description);
    setAuthor(response.data.product.author);
    setLanguage(response.data.product.language);
    setPrice(response.data.product.price);
    setStock(response.data.product.stock);
    setOpt(response.data.product.categoryId.name);
    set_Id(response.data.product.categoryId._id);
    setSku(response.data.product.sku);
    setImage(response.data.product.images);
    setActiveImage(response.data.product.images[0]);
    if (response.data.product.offerId) {
      setOffer(response.data.product.offerId.offerAmount);
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
