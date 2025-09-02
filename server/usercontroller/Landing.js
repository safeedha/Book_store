const Product = require('../Model/Product');
const Category = require('../Model/Category');
const User = require('../Model/User');
const Offer = require('../Model/Offer');

const newArrival = async (req, res, next) => {
  try {
    const products = await Product.find({ status: 'unblock' })
      .populate({
        path: 'categoryId',
        match: { status: 'unblock' },
      })
      .populate('offerId')
      .sort({ createdAt: -1 })
      .limit(8)
      .exec();

    const filteredProducts = products.filter(
      (product) => product.categoryId !== null
    );

    res
      .status(200)
      .json({ message: 'New products fetched', product: filteredProducts });
  } catch (error) {
    next(error);
  }
};

const getAllProduct = async (req, res, next) => {
  try {
    const {page,itemsPerPage, priceSort, alphabetSort, categoryList, search } = req.query;
    
    const products = await Product.find({ status: 'unblock' })
      .populate({
        path: 'categoryId',
        match: { status: 'unblock' },
      })
      .populate('offerId')
      .exec();

    let filteredProducts = products.filter(
      (product) => product.categoryId !== null
    );

    if (search) {
      filteredProducts = filteredProducts.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (priceSort === 'low-to-high') {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'high-to-low') {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }

    if (alphabetSort === 'aA - zZ') {
      filteredProducts = filteredProducts.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    } else if (alphabetSort === 'zZ - aA') {
      filteredProducts = filteredProducts.sort((a, b) =>
        b.name.toLowerCase().localeCompare(a.name.toLowerCase())
      );
    }

    if (categoryList && categoryList.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        categoryList.includes(product.categoryId.name)
      );
    }
     
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    res
      .status(200)
      .json({
        message: 'Products fetched successfully',
        product: paginatedProducts,
        totalPages,
      });
  } catch (error) {
    next(error);
  }
};

const getAllCategory = async (req, res, next) => {
  try {
    const category = await Category.find({ status: 'unblock' });
    res.status(200).json({ message: 'New products fetched', category });
  } catch (error) {
    next(error);
  }
};

const getsingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id })
      .populate('categoryId', 'name')
      .populate('offerId');
    res.status(200).json({ message: 'single user data', product });
  } catch (error) {
    next(error);
  }
};

const getRelatedProducts = async (req, res, next) => {
  try {
    const { categoryId, excludeProductId } = req.query;
    const relatedProducts = await Product.find({
      categoryId: categoryId,
      _id: { $ne: excludeProductId },
    })
      .populate('offerId')
      .limit(5);

    res.status(200).json({ relatedProducts });
  } catch (error) {
    next(error);
  }
};

const userVerify = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (user.status === 'block') {
      return res.status(403).json({ message: 'User blocked' });
    } else {
      return res.status(200).json({ message: 'User not blocked' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newArrival,
  getAllProduct,
  getsingleProduct,
  getRelatedProducts,
  getAllCategory,
  userVerify,
};
