import { useEffect, useState} from 'react';
import Navbar from '@/Reusable/Navbar';
import { useNavigate, useParams, Link } from 'react-router-dom';
import instance from '@/instance';
import { useSelector } from 'react-redux';
import Footer from '@/Reusable/Footer';
import { Lens } from '@/components/ui/lens';

import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { cartQuantityUpdate } from '../../feature/cartSlice';
import { logoutUser } from '../../feature/userSlice';
import { productInformation } from '../../User_apiservices/Product';
import {
  wishListadd,
  wishListremove,
  WishListSatus,
} from '@/User_apiservices/wishlist';

function Singleproduct() {
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const user = useSelector((state) => state.user.userInfo);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [language, setLanguage] = useState('');
  const [price, setPrice] = useState(0);
  const [offer, setOffer] = useState(null);

  const [stock, setStock] = useState(0);
  const [sku, setSku] = useState('');
  const [opt, setOpt] = useState(''); // For category options
  const [image, setImage] = useState([]);
  const [activeImage, setActiveImage] = useState(null); // For selected image
  const [hovering, setHovering] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [_id, set_Id] = useState(null);
  const { id } = useParams();
  const [filled, setFilled] = useState(false);
  console.log(sku)
  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        await productInformation(
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
        );
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      getSingleProduct();
    }
  }, [id]);

  useEffect(() => {
    const getRelatedProducts = async () => {
      if (_id) {
        try {
          const response = await instance.get(`/user/related-products`, {
            params: { categoryId: _id, excludeProductId: id },
          });
          setRelatedProducts(response.data.relatedProducts);
        } catch (error) {
          console.error('Failed to fetch related products:', error);
        }
      }
    };

    getRelatedProducts();
  }, [_id, id]);

  useEffect(() => {
    const getWisListStaaus = async () => {
      try {
        console.log(id);
        await WishListSatus(id, setFilled, dispatch, logoutUser);
      } catch (error) {
        console.log(error);
      }
    };
    getWisListStaaus();
  }, [id, _id,dispatch]);

  const changeImage = (img) => {
    setActiveImage(img);
  };

  const singleProduct = (id) => {
    naviagte(`/product/${id}`);
  };

  const cartHandle = async () => {
    try {
      if (!user) {
        toast.error('To add product to cart pleas login');
        return;
      }
      const response = await instance.post('/user/cart', { productId: id });
      if (response.data.message === 'Cart item quantity updated') {
        toast.success('product already in cart,quantity is upadted');
      }
      if (response.status == 201) {
        toast.success('product added to cart');
        dispatch(cartQuantityUpdate(true));
        return;
      }
    } catch (error) {
      if (error.response.data.message === 'User blocked') {
        toast.error("Your acoount is blocked you can't add produt to cart");
        setTimeout(() => {
          dispatch(logoutUser());
        }, 200);
        return;
      }
      if (
        error.response.data.message === 'The requested quantity not availabel'
      ) {
        return toast.error(error.response.data.message);
      }
      if (
        error.response.data.message ===
        "Oops! There's a limit of 5 units per person for this product. Adjust the quantity to proceed."
      ) {
        return toast.error(
          "Oops! There's a limit of 5 units per person for this product. Adjust the quantity to proceed."
        );
      }
    }
  };

  const WhishListAdd = async () => {
    if (!user) {
      toast.error('To add product to Wishlist, please log in');
      return;
    }
    if (!filled) {
      await wishListadd(setFilled, toast, id);
    } else {
      await wishListremove(setFilled, toast, id);
    }
  };

  return (
    <>
      <div className="bg-white ">
        <Navbar user={user ? user.name : null} />
        <div>Singleproduct</div>
        <Toaster position="top-center" richColors />
        <nav aria-label="breadcrumb" className="bg-white p-4 rounded pt-16">
          <ul className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link to="/" className="hover:text-blue-500">
                Home <span className="text-gray-400">&gt;</span>
              </Link>
            </li>
            <li>
              <Link to="/product" className="hover:text-blue-500">
                Product <span className="text-gray-400">&gt;</span>
              </Link>
            </li>
            <li>
              <span className="font-medium text-gray-800">{productName}</span>
            </li>
          </ul>
        </nav>

        <div className="flex flex-wrap lg:flex-nowrap p-4 gap-4">
          <div className="flex flex-col space-y-4 mr-8 w-full lg:w-1/4">
            {image.map((img, index) => (
              <div key={index} onClick={() => changeImage(img)}>
                <img
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>

          <div className="flex-1 w-full lg:w-1/2 items-center mt-10 pt-16 relative">
            <div className="bg-white border border-red-600 shadow-lg rounded-lg h-72 flex justify-center items-center relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={filled ? 'red' : 'none'}
                stroke="red"
                strokeWidth="2"
                className="absolute top-4 right-4 w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                onClick={WhishListAdd}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {activeImage && (
                <Lens
                  hovering={hovering}
                  setHovering={setHovering}
                  className="mt-4"
                >
                  <img
                    src={activeImage || ''}
                    alt=""
                    className="w-64 h-64 object-cover rounded-md m-2 border border-gray-300"
                  />
                </Lens>
              )}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 w-full h-max lg:w-1/3 relative">
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              {productName}{' '}
            </h1>
            <p className="text-gray-600 mb-2 text-sm">{description}</p>
            <div className="text-gray-700 text-sm mb-1">
              <strong>Author:</strong> {author}
            </div>
            <div className="text-gray-700 text-sm mb-1">
              <strong>Language:</strong> {language}
            </div>
            <div className="text-red-700 text-sm mb-1">
              <strong>Price:</strong>{' '}
              <span
                className={`text-price-600 font-semibold ${offer ? 'line-through' : ''}`}
              >
                &#8377;{price}
              </span>
            </div>
            {offer && (
              <div className="text-sm mb-1 text-green-600">
                <strong>Offer Price:</strong>{' '}
                <span className="text-green-600 font-semibold">
                  &#8377;{Math.ceil(price - (price * offer) / 100)}
                </span>
                <br></br>
                <span className="text-green-600 font-semibold">
                  {' '}
                  {offer}% offer
                </span>
              </div>
            )}
            <div className="text-gray-700 text-sm mb-1">
              <strong>Category:</strong> {opt}
            </div>
            <div
              className={`text-gray-700 text-sm mb-1 ${
                stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <strong>Stock:</strong> {stock > 0 ? 'Available' : 'Out of Stock'}
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                className={`font-semibold py-2 px-4 rounded-md text-sm transition ${
                  stock > 0
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
                disabled={stock <= 0}
                onClick={cartHandle}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Ratings & Reviews
          </h2>
          <div className="flex items-center mb-4">
            <p className="text-2xl font-bold text-yellow-500">4.5</p>
            <div className="flex ml-2">
              <span className="text-yellow-500">★</span>
              <span className="text-yellow-500">★</span>
              <span className="text-yellow-500">★</span>
              <span className="text-yellow-500">★</span>
              <span className="text-gray-400">★</span>
            </div>
            <p className="text-gray-600 ml-2">(50 Reviews)</p>
          </div>

          <div className="space-y-4">
            {/* Review 1 */}
            <div className="border-b pb-4">
              <p className="font-semibold text-gray-800">John Doe</p>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-yellow-500">★</span>
                <span className="text-yellow-500">★</span>
                <span className="text-yellow-500">★</span>
                <span className="text-gray-400">★</span>
              </div>
              <p className="text-gray-600 mt-2">
                Great product! Highly recommended.
              </p>
            </div>

            {/* Review 2 */}
            <div className="border-b pb-4">
              <p className="font-semibold text-gray-800">Jane Smith</p>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-yellow-500">★</span>
                <span className="text-yellow-500">★</span>
                <span className="text-gray-400">★</span>
                <span className="text-gray-400">★</span>
              </div>
              <p className="text-gray-600 mt-2">Good, but could be better.</p>
            </div>

            {/* Review 3 */}
            <div className="border-b pb-4">
              <p className="font-semibold text-gray-800">Alice Brown</p>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-yellow-500">★</span>
                <span className="text-yellow-500">★</span>
                <span className="text-yellow-500">★</span>
                <span className="text-yellow-500">★</span>
              </div>
              <p className="text-gray-600 mt-2">Absolutely loved it!</p>
            </div>
          </div>

          {/* Write a Review */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Write a Review
            </h3>
            <textarea
              className="w-full p-2 mt-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Share your thoughts..."
              rows="4"
            ></textarea>
            <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mt-4 hover:bg-blue-600">
              Submit Review
            </button>
          </div>
        </div>

        <div className="m-10 ">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedProducts.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg p-4 bg-white shadow-md "
                onClick={() => singleProduct(product._id)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600">${product.price}</p>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Singleproduct;
