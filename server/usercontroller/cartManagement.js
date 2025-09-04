const Cart = require('../Model/Cart');
const Product = require('../Model/Product');
const User = require('../Model/User');

const addtoCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const { id } = req.user;

    const user = await User.findById({ _id: id });
    if (user.status === 'block') {
      return res.status(403).json({ message: 'User is blocked' });
    }

    const product = await Product.findOne({ _id: productId }).populate(
      'offerId'
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingCartItem = await Cart.findOne({
      user_id: id,
      product_id: productId,
    });

    if (existingCartItem) {
      if (existingCartItem.quantity >= product.stock) {
        return res
          .status(409)
          .json({ message: 'The requested quantity is not available' });
      }

      if (existingCartItem.quantity >= 5) {
        return res.status(409).json({
          message:
            "Oops! There's a limit of 5 units per person for this product. Adjust the quantity to proceed.",
        });
      }

      existingCartItem.quantity += 1;
      await existingCartItem.save();

      return res.status(200).json({ message: 'Cart item quantity updated' });
    } else {
      if (product.stock < 1) {
        return res.status(409).json({ message: 'Product is out of stock' });
      }

      const newCartItem = new Cart({
        user_id: id,
        product_id: productId,
        quantity: 1,
      });

      await newCartItem.save();

      return res.status(201).json({ message: 'Product added to cart' });
    }
  } catch (error) {
    next(error);
  }
};

const getCartProduct = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById({ _id: id });
    if (user.status === 'block') {
      return res.status(403).json({ message: 'User blocked' });
    }
    const cart = await Cart.find({ user_id: id })
      .populate({
        path: 'product_id',
        populate: {
          path: 'offerId',
        },
      })
      .populate('user_id');

    res.status(200).json({ message: 'cart fetched sucessfully', cart });
  } catch (error) {
    next(error);
  }
};

const deleteCarttItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const del = await Cart.deleteOne({ _id: id });
    if (del.deletedCount === 0) {
      return res.status(404).json({ message: 'cart not found' });
    }
    const remains = await Cart.find({})
      .populate('product_id')
      .populate('user_id');
    return res
      .status(200)
      .json({ message: 'Cart deleted successfully', remains });
  } catch (error) {
    next(error);
  }
};

const getQuantitCart = async (req, res, next) => {
  try {
    const { id } = req.user;
    const count = await Cart.countDocuments({ user_id: id });
    res.status(200).json({ message: 'count getted', count });
  } catch (error) {
    next(error);
  }
};

const addQuantityCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { id } = req.user;
    const { productid } = req.body;

    const user = await User.findById({ _id: id });
    if (user.status === 'block') {
      return res.status(403).json({ message: 'User blocked' });
    }

    const product = await Product.findOne({ _id: productid }).populate(
      'offerId'
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cartItem = await Cart.findById(cartId)
      .populate('product_id')
      .populate('user_id');
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (cartItem.quantity >= product.stock) {
      return res
        .status(409)
        .json({ message: 'The requested quantity is not available' });
    }

    if (cartItem.quantity >= 5) {
      return res.status(409).json({
        message:
          "Oops! There's a limit of 5 units per person for this product. Adjust the quantity to proceed.",
      });
    }

    cartItem.quantity += 1;
    await cartItem.save();

    const cart_all = await Cart.find({ user_id: id })
      .populate({
        path: 'product_id',
        populate: {
          path: 'offerId',
        },
      })
      .populate('user_id');

    res
      .status(200)
      .json({ message: 'Cart fetched successfully', cart: cart_all });
  } catch (error) {
    next(error);
  }
};

const subQuantityCart = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { id } = req.user;
    const { productid } = req.body;
     await Product.findOne({ _id: productid }).populate(
      'offerId'
    );
    const user = await User.findById(id);
    if (user.status === 'block') {
      return res.status(403).json({ message: 'User blocked' });
    }

    const exist = await Cart.findOne({ _id: cartId }).populate('product_id');
    const productStock = exist.product_id.stock;
    if (productStock === 0) {
      await Cart.deleteOne({ _id: cartId });
      const cart_all = await Cart.find({ user_id: id })
        .populate({
          path: 'product_id',
          populate: {
            path: 'offerId',
          },
        })
        .populate('user_id');
      return res
        .status(409)
        .json({
          message: 'This product is out of stock and removed from your cart',
          cart: cart_all,
        });
    }

    if (productStock < exist.quantity) {
      await Cart.updateOne(
        { _id: cartId },
        { $set: { quantity: productStock } }
      );
      const cart_all = await Cart.find({ user_id: id })
        .populate({
          path: 'product_id',
          populate: {
            path: 'offerId',
          },
        })
        .populate('user_id');
      return res
        .status(409)
        .json({
          message: 'Quantity exceeded stock. Updated to available stock.',
          cart: cart_all,
        });
    }

    if (exist.quantity === 1) {
      return res
        .status(422)
        .json({ message: 'Quantity cannot be less than 1' });
    }

    const update = await Cart.updateOne(
      { _id: cartId },
      { $set: { quantity: exist.quantity - 1 } }
    );
    if (update.modifiedCount === 1) {
      const cart_all = await Cart.find({ user_id: id })
        .populate({
          path: 'product_id',
          populate: {
            path: 'offerId',
          },
        })
        .populate('user_id');
      return res
        .status(200)
        .json({ message: 'cart fetched sucessfully', cart: cart_all });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addtoCart,
  getCartProduct,
  deleteCarttItem,
  getQuantitCart,
  addQuantityCart,
  subQuantityCart,
};
