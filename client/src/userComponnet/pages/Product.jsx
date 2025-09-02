import React, { useState, useEffect, useContext } from 'react';
import Navbar from '@/Reusable/Navbar';
import { useSelector } from 'react-redux';
import instance from '../../instance';
import Footer from '@/Reusable/Footer';
import { useNavigate } from 'react-router-dom';
import { fetchCategory } from '../../User_apiservices/Product';
import { shopcontext } from '../../context/Shopcontex';
import UserPagination from '@/Reusable/UserPagination';

function Product() {
  const { search } = useContext(shopcontext);
  const user = useSelector((state) => state.user.userInfo);
  const [price, setPrice] = useState(null);
  const [char, setChar] = useState(null);
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

 
const itemsPerPage = 9;
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await instance.get('user/product', {
          params: {
            page,
            itemsPerPage ,
            priceSort: price,
            alphabetSort: char,
            categoryList: categoryList,
            search: search,
          },
        });
        if (response.status === 200) {
          setProduct(response.data.product);
          setTotalPages(response.data.totalPages)
        }
      } catch (error) {
        console.error('Error fetching new products:', error);
      }
    };
    fetchProduct();
  }, [price, char, categoryList, search,page]);

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const response = await fetchCategory();
        setCategory(response.data.category);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategoryList();
  }, []);

  const priceHandle = (e) => {
    setPrice(e.target.value);
  };

  const alphabetSortHandler = (e) => {
    setChar(e.target.value);
  };

  const categoryListHandle = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCategoryList((prevList) => [...prevList, value]);
    } else {
      setCategoryList((prevList) => prevList.filter((item) => item !== value));
    }
  };

  const singleProduct = (id) => {
    navigate(`/product/${id}`);
  };

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const currentProducts = product.slice(startIndex, startIndex + itemsPerPage);
  // const totalPages = Math.ceil(product.length / itemsPerPage);

  const item = product.map((product, index) => (
    <div
      key={index}
      className="bg-white shadow-md rounded-lg p-4 text-center"
      onClick={() => singleProduct(product._id)}
    >
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p
        className={`text-red-600 text-sm ${
          new Date(product.offerId?.expiryDate) > new Date()
            ? 'line-through'
            : ''
        }`}
      >
        &#8377;{product.price}
      </p>

      {product.offerId &&
        new Date(product.offerId?.expiryDate) > new Date() && (
          <p className="text-sm text-green-500 font-semibold">
            &#8377;
            {Math.ceil(
              product.price -
                (product.price * product.offerId.offerAmount) / 100
            )}
          </p>
        )}

      {product.offerId && new Date(product.offerId.expiryDate) > new Date() && (
        <p className="text-sm text-green-500">
          {product.offerId.offerAmount}% Off
        </p>
      )}
    </div>
  ));

  const cat = category.map((item, index) => (
    <div
      key={index}
      className="flex items-center space-x-3 p-2 hover:bg-gray-50 w-24"
    >
      <input
        type="checkbox"
        value={item.name}
        id={`checkbox-${index}`}
        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        onChange={categoryListHandle}
      />
      <label
        htmlFor={`checkbox-${index}`}
        className="text-sm font-medium text-gray-700"
      >
        {item.name}
      </label>
    </div>
  ));

  return (
    <div className="bg-white">
      <Navbar user={user ? user.name : null} />
      <br />

      <div className="flex pt-16">
        <div className="p-4 mt-16">
          <p className="font-medium text-gray-700">Select Categories</p>
          {cat}
        </div>

        <div className="flex-1">
          <div className="container mx-auto p-4">
            <div className="flex justify-end flex-wrap">
              <div className="m-2 ml-64">
                <select
                  className="border-2 border-indigo-600 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={priceHandle}
                >
                  <option value="" disabled selected>
                    Price range
                  </option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </div>

              <div className="m-2">
                <select
                  className="border-2 border-indigo-600 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={alphabetSortHandler}
                >
                  <option value="" disabled selected>
                    Sort based on alphabet
                  </option>
                  <option value="aA - zZ">aA - zZ</option>
                  <option value="zZ - aA">zZ - aA</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {item}
            </div>

             <UserPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(page) => setPage(page)}
            /> 
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Product;
