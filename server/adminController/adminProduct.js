const Product = require('../Model/Product');
const Category = require('../Model/Category');

const addProduct = async (req, res, next) => {
  try {
    const {
      formatProductName,
      description,
      author,
      language,
      price,
      category,
      stock,
      sku,
      uploaded,
    } = req.body;

    const exist = await Product.findOne({ name: formatProductName });
    if (exist) {
      return res.status(409).json({ message: 'Product already exists' });
    }

    const skuExist = await Product.findOne({ sku: sku });
    if (skuExist) {
      return res
        .status(409)
        .json({ message: 'Product with this SKU already exists' });
    }

    const categoryData = await Category.findOne({ name: category });
    if (!categoryData) {
      return res.status(400).json({ message: 'Invalid category name' });
    }

    const categoryId = categoryData._id;

    const stockStatus = stock === 0 ? 'out of stock' : 'available';

    const newProduct = await Product.create({
      name: formatProductName,
      description: description,
      language: language,
      price: price,
      author: author,
      categoryId: categoryId,
      stock: stock,
      sku: sku,
      images: uploaded,
      stockStatus: stockStatus,
    });
    console.log(newProduct);
    return res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    let { page = 1, rowsPerPage = 3 } = req.query;  // default values
    page = parseInt(page);
    rowsPerPage = parseInt(rowsPerPage);

    const totalProducts = await Product.countDocuments();

    const products = await Product.find({})
      .populate('categoryId', 'name')
      .skip((page - 1) * rowsPerPage)
      .limit(rowsPerPage);

    res.status(200).json({
      message: 'Products fetched successfully',
      product: products,
      totalPages: Math.ceil(totalProducts / rowsPerPage),
    });
  } catch (error) {
    next(error);
  }
};


const statusUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { status } = req.body;
    console.log(status);
    const update = await Product.updateOne(
      { _id: id },
      {
        $set: {
          status: status,
        },
      }
    );
    if (update.matchedCount === 1) {
      res.status(200).json({ message: 'updation sucessfull' });
    }
  } catch (error) {
    next(error);
  }
};

const getsingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id }).populate(
      'categoryId',
      'name'
    );
    res.status(200).json({ message: 'single user data', product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    console.log('Updating product');
    const { id } = req.params;
    const {
      formatProductName,
      description,
      author,
      language,
      price,
      category,
      stock,
      sku,
      crop,
    } = req.body;
    const exist = await Product.findOne({
      name: formatProductName,
      _id: { $ne: id },
    });
    if (exist) {
      return res.status(409).json({ message: 'This product already exists' });
    }
    const existsku = await Product.findOne({ sku: sku, _id: { $ne: id } });
    if (existsku) {
      return res.status(409).json({ message: 'This SKU already exists' });
    }
    const categoryData = await Category.findOne({ name: category });
    if (!categoryData) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const categoryId = categoryData._id;
    const stockStatus = stock === 0 ? 'out of stock' : 'available';

    await Product.updateOne(
      { _id: id },
      {
        $set: {
          name: formatProductName,
          description,
          author,
          language,
          price,
          categoryId,
          stock,
          sku,
          images: crop,
          stockStatus,
        },
      }
    );

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
  getProduct,
  statusUpdate,
  getsingleProduct,
  updateProduct,
};
