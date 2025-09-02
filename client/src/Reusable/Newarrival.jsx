import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNewProduct } from '@/User_apiservices/Product';

function Newarrival() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchNewProduct();
        console.log(response.data.product);
        setProducts(response.data.product);
      } catch (error) {
        console.error('Failed to fetch new products:', error);
      }
    };
    fetchProducts();
  }, []);

  const singleProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const item = products.map((product, index) => (
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
        className={`text-gray-600 text-sm ${new Date(product.offerId?.expiryDate) > new Date() ? 'line-through' : ''}`}
      >
        ${product.price}
      </p>

      {product.offerId && new Date(product.offerId.expiryDate) > new Date() && (
        <p className="text-sm text-green-500">
          $
          {Math.ceil(
            product.price - (product.price * product.offerId.offerAmount) / 100
          )}
        </p>
      )}

      {product.offerId && new Date(product.offerId.expiryDate) > new Date() && (
        <p className=" text-sm text-green-500">
          {product.offerId.offerAmount}%Off
        </p>
      )}
    </div>
  ));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-red-500 text-4xl font-bold">Latest Arrival</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {item}
      </div>
    </div>
  );
}

export default Newarrival;
