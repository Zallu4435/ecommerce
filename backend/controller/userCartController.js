const Cart = require("../model/Cart");
const Product = require("../model/Products");
const Wishlist = require("../model/Wishlist");
const Comparison = require("../model/Comparison");
const mongoose = require("mongoose");

exports.addToCart = async (req, res) => {
  const { productId, quantity, size, color } = req.body;

  try {
    const userId = req.user;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const selectedColor = color || product.colorOption[0];

    const selectedSize =
      size || (product.sizeOption.length > 0 ? product.sizeOption[0] : null);

    if (!product.colorOption.includes(selectedColor)) {
      return res.status(400).json({ message: "Invalid color selected" });
    }

    if (selectedSize && !product.sizeOption.includes(selectedSize)) {
      return res.status(400).json({ message: "Invalid size selected" });
    }

    const limit = 50; // Cart limit
    // Check if stock is sufficient
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: "Product is out of stock or insufficient quantity" });
    }

    let cart = await Cart.findOne({ userId });

    // Check Cart Limit
    if (cart && cart.items.length >= limit) {
      return res.status(400).json({ message: `Cart is full. Maximum ${limit} items allowed.` });
    }

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId.toString() &&
        item.color === selectedColor &&
        item.size === selectedSize
    );

    if (existingItemIndex >= 0) {
      return res.status(400).json({ message: "This product is already in your cart" });
    } else {
      cart.items.push({
        productId,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });
    }

    await cart.save();

    // Automatically remove the product from wishlist if it exists
    try {
      await Wishlist.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId: productId } } },
        { new: true }
      );
    } catch (wishlistError) {
      // Log the error but don't fail the cart operation
      console.error("Error removing item from wishlist:", wishlistError);
    }

    // Automatically remove the product from comparison if it exists
    try {
      await Comparison.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId: productId } } },
        { new: true }
      );
    } catch (comparisonError) {
      // Log the error but don't fail the cart operation
      console.error("Error removing item from comparison:", comparisonError);
    }

    res.status(200).json({ message: "Item successfully added to cart!", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    const cartItems = await Cart.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $lookup: {
          from: "reviews",
          localField: "productDetails._id",
          foreignField: "productId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          totalReviews: { $size: "$reviews" },
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: {
                $avg: "$reviews.rating",
              },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          cartItemId: { $toString: "$items._id" },
          productName: "$productDetails.productName",
          productImage: "$productDetails.image",
          originalPrice: "$productDetails.originalPrice",
          offerPrice: "$productDetails.offerPrice",
          quantity: "$items.quantity",
          stockQuantity: "$productDetails.stockQuantity",
          productId: "$productDetails._id",
          category: "$productDetails.category",
          totalReviews: 1,
          averageRating: 1,
        },
      },
    ]);

    return res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).json({ message: "Error fetching cart items" });
  }
};

exports.removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Cart.findOneAndUpdate(
      { userId: req.user },
      { $pull: { items: { _id: id } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    return res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.status(500).json({ message: "Error removing item from cart" });
  }
};

exports.calculateCartTotal = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id });
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const tax = (subtotal * 0.08).toFixed(2);
    const shippingCost = 15.0;
    const total = (
      parseFloat(subtotal) +
      parseFloat(tax) +
      shippingCost
    ).toFixed(2);

    return res.status(200).json({
      subtotal: subtotal.toFixed(2),
      tax,
      shippingCost: shippingCost.toFixed(2),
      total,
    });
  } catch (error) {
    console.error("Error calculating cart total:", error);
    return res.status(500).json({ message: "Error calculating cart total" });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;

    if (!cartItemId || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "cartItemId and quantity are required" });
    }

    const cart = await Cart.findOne({ userId: req.user });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === cartItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const product = await Product.findById(cart.items[itemIndex].productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.stockQuantity) {
      return res.status(400).json({ message: "Out of stock" });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    return res.status(200).json({
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error updating cart item",
      error: error.message,
    });
  }
};
