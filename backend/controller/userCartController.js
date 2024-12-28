const Cart = require('../model/Cart')
const Product = require('../model/Products');
const ErrorHandler = require('../utils/ErrorHandler');
const mongoose = require('mongoose');


// Controller to handle Add to Cart
exports.addToCart = async (req, res) => {
  const { productId, quantity, size, color } = req.body;
  console.log(productId, quantity, size, color, "details from the frontend");

  try {
    const userId = req.user; // Assuming user authentication middleware adds the user ID

    // Find the product to validate it exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Select default color if no color is provided
    const selectedColor = color || product.colorOption[0]; // Default to the first available color

    // Select default size if no size is provided
    const selectedSize = size || (product.sizeOption.length > 0 ? product.sizeOption[0] : null);

    // Check if the selected color is valid
    if (!product.colorOption.includes(selectedColor)) {
      return res.status(400).json({ message: 'Invalid color selected' });
    }

    // Check if the selected size is valid
    if (selectedSize && !product.sizeOption.includes(selectedSize)) {
      return res.status(400).json({ message: 'Invalid size selected' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    console.log(cart.items, "item");

    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.color === selectedColor &&
        item.size === selectedSize
    );

    console.log(existingItemIndex, "existingItemIndex");

    if (existingItemIndex >= 0) {
      // If item exists, update the quantity
      cart.items[existingItemIndex].quantity = quantity;
    } else {
      // Otherwise, add new item to cart
      cart.items.push({ productId, quantity, size: selectedSize, color: selectedColor });
    }

    // Save the cart
    await cart.save();

    res.status(200).json({ message: 'Item successfully added to cart!', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};



exports.getCartItems = async (req, res) => {
  try {
    // Debugging: Log userId and its type
    // console.log('req.user:', req.user, 'Type:', typeof req.user);

    // Convert req.user to ObjectId
    const userId = new mongoose.Types.ObjectId(req.user);

    // Aggregation pipeline
    const cartItems = await Cart.aggregate([
      {
        $match: { userId: userId }, // Match cart items for the specific user
      },
      {
        $unwind: '$items', // Unwind the items array in the cart
      },
      {
        $lookup: {
          from: 'products', // Your Product collection name
          localField: 'items.productId', // Field in Cart referencing Product
          foreignField: '_id', // Field in Product collection
          as: 'productDetails', // Alias for the joined data
        },
      },
      {
        $unwind: '$productDetails', // Flatten productDetails array
      },
      {
        $project: {
          _id: 0, // Exclude _id from the final result
          cartItemId: { $toString: '$items._id' }, // Include productId to allow removal
          productName: '$productDetails.productName', // Product name
          productImage: '$productDetails.image', // Product image
          originalPrice: '$productDetails.originalPrice', // Product price
          ratings: '$productDetails.ratings', // Product ratings
          quantity: '$items.quantity', // Quantity from cart
          stockQuantity: '$productDetails.stockQuantity'
        },
      },
    ]);

    // Debugging: Log the final aggregated cart items
    console.log('Cart Items with Product Details:', cartItems);

    // Send the response with cart items
    return res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return res.status(500).json({ message: 'Error fetching cart items' });
  }
};

// Controller to remove an item from the cart
exports.removeFromCart = async (req, res) => {
  const { id } = req.params; // Item ID passed as parameter in the URL

  // console.log(req.params , "id fromthe cart")

  try {
    // Find and remove the item from the user's cart
    const result = await Cart.findOneAndUpdate(
      { userId: req.user },
      { $pull: { items: { _id: id } } }, // Pull the item with the given ID from the cart's items array
      { new: true }
    );
    
    if (!result) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    return res.status(200).json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ message: 'Error removing item from cart' });
  }
};

// Controller to calculate the total price (including subtotal, tax, and shipping)
exports.calculateCartTotal = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id }); // Fetch user's cart items
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = (subtotal * 0.08).toFixed(2); // 8% tax
    const shippingCost = 15.0; // Flat shipping cost
    const total = (parseFloat(subtotal) + parseFloat(tax) + shippingCost).toFixed(2);

    return res.status(200).json({
      subtotal: subtotal.toFixed(2),
      tax,
      shippingCost: shippingCost.toFixed(2),
      total,
    });
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return res.status(500).json({ message: 'Error calculating cart total' });
  }
};



// // Update cart item quantity
// exports.updateCartQuantity = async (req, res) => {
//   try {
//     const { cartItemId, quantity } = req.body;

//     if (!cartItemId || quantity === undefined) {
//       return res.status(400).json({ message: 'cartItemId and quantity are required' });
//     }

//     // Find the cart by user ID
//     const cart = await Cart.findOne({ userId: req.user });

//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     // Find the index of the item in the cart items array
//     const itemIndex = cart.items.findIndex(item => item._id.toString() === cartItemId);

//     if (itemIndex === -1) {
//       return res.status(404).json({ message: 'Cart item not found' });
//     }

//     // Update the quantity of the found item
//     cart.items[itemIndex].quantity = quantity;

//     // Save the updated cart
//     await cart.save();

//     return res.status(200).json({
//       message: 'Cart item updated successfully',
//       cart,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'Error updating cart item',
//       error: error.message,
//     });
//   }
// };


exports.updateCartQuantity = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;

    if (!cartItemId || quantity === undefined) {
      return res.status(400).json({ message: 'cartItemId and quantity are required' });
    }

    // Find the cart by user ID
    const cart = await Cart.findOne({ userId: req.user });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the item in the cart items array
    const itemIndex = cart.items.findIndex(item => item._id.toString() === cartItemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Retrieve the product from your database (assuming you have a Product model)
    const product = await Product.findById(cart.items[itemIndex].productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the desired quantity exceeds the available stock
    if (quantity > product.stockQuantity) {
      return res.status(400).json({ message: 'Out of stock' });
    }

    // Update the quantity of the found item
    cart.items[itemIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      message: 'Cart item updated successfully',
      cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error updating cart item',
      error: error.message,
    });
  }
};
