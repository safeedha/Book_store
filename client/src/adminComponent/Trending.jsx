import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { getTopProduct, getTopCategory } from './AdminApi/Trending';
import './Trending.css';

function Trending() {
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);

  // Fetch top products
  useEffect(() => {
    const fetchTopProduct = async () => {
      try {
        await getTopProduct(setProduct);
      } catch (error) {
        console.error('Error fetching top products:', error);
      }
    };
    fetchTopProduct();
  }, []);

  // Fetch top categories
  useEffect(() => {
    const fetchTopCategory = async () => {
      try {
        await getTopCategory(setCategory);
      } catch (error) {
        console.error('Error fetching top categories:', error);
      }
    };
    fetchTopCategory();
  }, []);

  const productData = product.map((item, index) => (
    <p
      key={index}
      className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center hover:shadow-lg transition"
    >
      <span className="text-lg font-medium text-gray-800">
        {index + 1}. {item.name}
      </span>
      <span className="text-sm font-semibold text-blue-600">
        Sales: {item.sellingcount}
      </span>
    </p>
  ));

  const categoryData = category.map((item, index) => (
    <div
      key={index}
      className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center hover:shadow-lg transition"
    >
      <span className="text-lg font-medium text-gray-800">
        {index + 1}. {item.name}
      </span>
      <span className="text-sm font-semibold text-blue-600">
        Sales: {item.sellingcount}
      </span>
    </div>
  ));

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-6 overflow-hidden space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Trending Analytics
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Top 10 Products
              </h2>
              <div className="space-y-4">{productData}</div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Top 10 Categories
              </h2>
              <div className="space-y-4">{categoryData}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Trending;
