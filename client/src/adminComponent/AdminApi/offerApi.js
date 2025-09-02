import adminInstance from './AdminInstance';

export const getOffer = async (setOffer,page,itemsPerPage,setToatalPage) => {
  try {
    const response = await adminInstance.get('/offer',{params:{page,itemsPerPage}});
    setOffer(response.data.offer);
    setToatalPage(response.data.totalPages)
  } catch (error) {
    console.log(error);
  }
};

export const deleteOffer = async (id, setOffer) => {
  try {
    const response = await adminInstance.delete(`/offer/${id}`);
    setOffer(response.data.offer);
  } catch (error) {
    console.log(error);
  }
};
