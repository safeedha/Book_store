import instance from './instance';

export const getAddress = async (setAddress) => {
  try {
    const response = await instance.get('/user/address');
    console.log('Address Response:', response);

    if (response.status === 200) {
      setAddress(response.data.address);
    }
  } catch (error) {
    if (error.response) {
      const { message } = error.response.data;
      console.error('Error fetching address:', message || 'Unknown error');
    } else {
      console.error('Unexpected error:', error.message);
    }
  }
};

export const addAddress = async (
  name,
  phone,
  streetAddress,
  state,
  district,
  pincode,
  city,
  setAddress,
  setAdd,
  toast,
  setFormData
) => {
  try {
    const response = await instance.post('/user/address', {
      name,
      phone,
      streetAddress,
      state,
      district,
      pincode,
      city,
    });
    if (response.status === 201) {
      toast.success('Address added');
      setAddress((prev) => [...prev, response.data.address]);
      setAdd(false);
      setFormData({
        name: '',
        phone: '',
        streetAddress: '',
        state: '',
        district: '',
        pincode: '',
        city: '',
      });
    }
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const deletAddress = async (id, Swal, setAddress) => {
  try {
    const response = await instance.delete(`/user/address/${id}`);
    console.log(response);

    if (response.status === 200) {
      Swal.fire({
        title: 'Deleted!',
        text: 'Your address has been deleted.',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });
      setAddress(response.data.remains);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getoneAddress = async (setFormData, id) => {
  try {
    const response = await instance.get(`/user/address/${id}`);
    if (response.status === 200) {
      let add = response.data.address;
      setFormData({
        name: add.name,
        phone: add.phone,
        streetAddress: add.streetAddress,
        state: add.state,
        district: add.district,
        pincode: add.pincode,
        city: add.city,
      });
    }
  } catch (error) {
    console.error('Error fetching customer data:', error);
  }
};
export const updateAddress = async (
  id,
  toast,
  Navigate,
  name,
  phone,
  streetAddress,
  state,
  district,
  pincode,
  city
) => {
  try {
    const response = await instance.post(`/user/address/${id}`, {
      name,
      phone,
      streetAddress,
      state,
      district,
      pincode,
      city,
    });
    toast.success('pdoduct saved');
    Navigate(-1);
  } catch (error) {
    toast.error(error.response.data.message);
  }
};
