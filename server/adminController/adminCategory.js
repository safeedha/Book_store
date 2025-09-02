const Category = require('../Model/Category');

const addCategory = async (req, res, next) => {
  console.log(req.body);
  try {
    const { formattedCategoryName, uploadedUrl } = req.body;
    const existing = await Category.findOne({ name: formattedCategoryName });
    if (existing) {
      return res.status(409).json({ message: 'this category already exist' });
    }

    const category = await Category.create({
      name: formattedCategoryName,
      image: uploadedUrl,
    });
    console.log(category);

    res.status(201).json({ message: 'category added sucessfully' });
    console.llog(category);
  } catch (error) {
    next(error);
  }
};

 const getCategory = async (req, res, next) => {
  try {
    let { page = 1, rowsPerPage = 10 } = req.query;
    page = parseInt(page);
    rowsPerPage = parseInt(rowsPerPage);
    const totalCategories = await Category.countDocuments();
    const categories = await Category.find({})
      .skip((page - 1) * rowsPerPage)
      .limit(rowsPerPage);

    res.status(200).json({
      message: 'Categories fetched successfully',
      categories,
      totalPages: Math.ceil(totalCategories / rowsPerPage),
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
    const update = await Category.updateOne(
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

const getsingleCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'single user data', category });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    console.log('req.body', req.body);
    const { formattedCategoryName, uploadedUrl } = req.body;
    const { id } = req.params;

    const existingCategory = await Category.findOne({
      name: formattedCategoryName,
      _id: { $ne: id },
    });

    if (existingCategory) {
      return res.status(409).json({ message: 'Category name already exists' });
    }

    const update = await Category.updateOne(
      { _id: id },
      {
        $set: {
          name: formattedCategoryName,
          image: uploadedUrl,
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

module.exports = {
  addCategory,
  getCategory,
  statusUpdate,
  getsingleCategory,
  updateCategory,
};
