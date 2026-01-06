const Coupon = require("../model/Coupon");
const Product = require("../model/Products");
const ErrorHandler = require("../utils/ErrorHandler");
const mongoose = require("mongoose");

exports.getCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $addFields: {
          applicableUserIds: {
            $map: {
              input: "$applicableUsers",
              as: "userId",
              in: { $toObjectId: "$$userId" },
            },
          },
          applicableProductIds: {
            $map: {
              input: "$applicableProducts",
              as: "productId",
              in: { $toObjectId: "$$productId" },
            },
          },
          appliedUserIds: {
            $map: {
              input: "$appliedUsers",
              as: "appliedUserId",
              in: { $toObjectId: "$$appliedUserId" },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "applicableUserIds",
          foreignField: "_id",
          as: "applicableUserDetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "applicableProductIds",
          foreignField: "_id",
          as: "applicableProductDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "appliedUserIds",
          foreignField: "_id",
          as: "appliedUserDetails",
        },
      },
      {
        $project: {
          couponCode: 1,
          title: 1,
          description: 1,
          discount: 1,
          minAmount: 1,
          maxAmount: 1,
          expiry: 1,
          applicableUsers: {
            $map: {
              input: "$applicableUserDetails",
              as: "user",
              in: {
                id: "$$user._id",
                email: "$$user.email",
              },
            },
          },
          applicableProducts: {
            $map: {
              input: "$applicableProductDetails",
              as: "product",
              in: {
                id: "$$product._id",
                productName: "$$product.productName",
              },
            },
          },
          appliedUsers: {
            $map: {
              input: "$appliedUserDetails",
              as: "appliedUser",
              in: {
                id: "$$appliedUser._id",
                email: "$$appliedUser.email",
              },
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    if (!coupon || coupon.length === 0) {
      return next(new ErrorHandler("Coupon not found", 404));
    }

    res.status(200).json({
      success: true,
      coupon: coupon[0],
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCoupons = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;

    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    const searchFilter = search
      ? {
        $or: [
          { couponCode: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
      : {};

    const coupons = await Coupon.find(searchFilter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .select("_id couponCode title discount expiry updatedAt createdAt");

    const totalCoupons = await Coupon.countDocuments(searchFilter);

    const formatted = coupons.map((c) => ({
      id: c._id,
      couponCode: c.couponCode,
      title: c.title,
      discount: c.discount,
      expiry: c.expiry,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    res.status(200).json({
      success: true,
      coupons: formatted,
      totalCoupons,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCoupons / limitNumber),
    });
  } catch (error) {
    next(error);
  }
};

exports.getCouponDetails = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return next(new ErrorHandler("Coupon not found", 404));
    }

    res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

exports.createCoupon = async (req, res, next) => {
  try {
    // Coupon code validation
    if (!req.body.couponCode || req.body.couponCode.trim() === "") {
      return next(new ErrorHandler("Coupon code is required", 400));
    }

    const couponCodeNormalized = req.body.couponCode.trim().toUpperCase();

    // Validate coupon code format
    if (!/^[A-Z0-9_-]+$/.test(couponCodeNormalized)) {
      return next(new ErrorHandler("Coupon code can only contain uppercase letters, numbers, hyphens, and underscores", 400));
    }

    if (couponCodeNormalized.length < 3 || couponCodeNormalized.length > 50) {
      return next(new ErrorHandler("Coupon code must be between 3 and 50 characters", 400));
    }

    // Title validation
    if (!req.body.title || req.body.title.trim() === "") {
      return next(new ErrorHandler("Coupon title is required", 400));
    }

    if (req.body.title.trim().length < 3 || req.body.title.trim().length > 100) {
      return next(new ErrorHandler("Coupon title must be between 3 and 100 characters", 400));
    }

    // Description validation
    if (!req.body.description || req.body.description.trim() === "") {
      return next(new ErrorHandler("Coupon description is required", 400));
    }

    if (req.body.description.trim().length < 10 || req.body.description.trim().length > 500) {
      return next(new ErrorHandler("Coupon description must be between 10 and 500 characters", 400));
    }

    // Discount validation
    if (
      !req.body.discount ||
      isNaN(req.body.discount) ||
      Number(req.body.discount) <= 0 ||
      Number(req.body.discount) > 70
    ) {
      return next(new ErrorHandler("Discount must be between 1 and 70 percent", 400));
    }

    // Min amount validation
    if (req.body.minAmount === undefined || req.body.minAmount === null) {
      return next(new ErrorHandler("Minimum purchase amount is required", 400));
    }

    if (isNaN(req.body.minAmount) || Number(req.body.minAmount) < 500) {
      return next(new ErrorHandler("Minimum purchase amount must be at least ₹500", 400));
    }

    if (Number(req.body.minAmount) > 100000) {
      return next(new ErrorHandler("Minimum purchase amount cannot exceed ₹1,00,000", 400));
    }

    // Max amount validation
    if (req.body.maxAmount === undefined || req.body.maxAmount === null) {
      return next(new ErrorHandler("Maximum discount amount is required", 400));
    }

    if (isNaN(req.body.maxAmount) || Number(req.body.maxAmount) <= 0) {
      return next(new ErrorHandler("Maximum discount amount must be greater than 0", 400));
    }

    if (Number(req.body.maxAmount) > 5000) {
      return next(new ErrorHandler("Maximum discount amount cannot exceed ₹5,000", 400));
    }

    // Validate relationship between minAmount and maxAmount
    // Minimum purchase must be at least 5x the max discount to prevent abuse
    if (Number(req.body.minAmount) < Number(req.body.maxAmount) * 5) {
      return next(new ErrorHandler("Minimum purchase amount must be at least 5 times the maximum discount amount", 400));
    }

    // Expiry date validation
    if (!req.body.expiry || isNaN(Date.parse(req.body.expiry))) {
      return next(new ErrorHandler("Valid expiry date is required", 400));
    }

    const expiryDate = new Date(req.body.expiry);
    const now = new Date();

    if (expiryDate <= now) {
      return next(new ErrorHandler("Expiry date must be in the future", 400));
    }

    // Check if expiry is too far in the future (e.g., more than 2 years)
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);

    if (expiryDate > twoYearsFromNow) {
      return next(new ErrorHandler("Expiry date cannot be more than 2 years in the future", 400));
    }

    // Usage limit validation
    if (req.body.usageLimit !== undefined && req.body.usageLimit !== null) {
      if (isNaN(req.body.usageLimit) || !Number.isInteger(Number(req.body.usageLimit)) || Number(req.body.usageLimit) < 1) {
        return next(new ErrorHandler("Usage limit must be a positive integer or leave empty for unlimited", 400));
      }
    }

    // Per user limit validation
    if (req.body.perUserLimit !== undefined && req.body.perUserLimit !== null) {
      if (isNaN(req.body.perUserLimit) || !Number.isInteger(Number(req.body.perUserLimit)) || Number(req.body.perUserLimit) < 1 || Number(req.body.perUserLimit) > 5) {
        return next(new ErrorHandler("Per user limit must be between 1 and 5", 400));
      }
    }

    // Check for existing coupon
    const existingCoupon = await Coupon.findOne({
      couponCode: { $regex: new RegExp(`^${couponCodeNormalized}$`, "i") },
    });

    if (existingCoupon) {
      return next(
        new ErrorHandler(
          "A coupon with this code already exists",
          400
        )
      );
    }

    // Create coupon
    let coupon;
    try {
      coupon = await Coupon.create({
        ...req.body,
        couponCode: couponCodeNormalized,
        usageCount: 0
      });
    } catch (err) {
      if (err && err.code === 11000) {
        return next(new ErrorHandler("A coupon with this code already exists", 400));
      }
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return next(new ErrorHandler(messages.join(', '), 400));
      }
      throw err;
    }

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    if (!req.params.id || req.params.id.trim() === "") {
      return next(new ErrorHandler("Coupon ID is required", 400));
    }

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return next(new ErrorHandler("Coupon not found", 404));
    }

    // Coupon code validation
    if (!req.body.couponCode || req.body.couponCode.trim() === "") {
      return next(new ErrorHandler("Coupon code is required", 400));
    }

    const couponCodeNormalized = req.body.couponCode.trim().toUpperCase();

    // Validate coupon code format
    if (!/^[A-Z0-9_-]+$/.test(couponCodeNormalized)) {
      return next(new ErrorHandler("Coupon code can only contain uppercase letters, numbers, hyphens, and underscores", 400));
    }

    if (couponCodeNormalized.length < 3 || couponCodeNormalized.length > 50) {
      return next(new ErrorHandler("Coupon code must be between 3 and 50 characters", 400));
    }

    // Title validation
    if (!req.body.title || req.body.title.trim() === "") {
      return next(new ErrorHandler("Coupon title is required", 400));
    }

    if (req.body.title.trim().length < 3 || req.body.title.trim().length > 100) {
      return next(new ErrorHandler("Coupon title must be between 3 and 100 characters", 400));
    }

    // Description validation
    if (req.body.description !== undefined) {
      if (!req.body.description || req.body.description.trim() === "") {
        return next(new ErrorHandler("Coupon description is required", 400));
      }
      if (req.body.description.trim().length < 10 || req.body.description.trim().length > 500) {
        return next(new ErrorHandler("Coupon description must be between 10 and 500 characters", 400));
      }
    }

    // Discount validation
    if (req.body.discount !== undefined) {
      if (isNaN(req.body.discount) || Number(req.body.discount) <= 0 || Number(req.body.discount) > 70) {
        return next(new ErrorHandler("Discount must be between 1 and 70 percent", 400));
      }
    }

    // Min/Max amount validation
    if (req.body.minAmount !== undefined && req.body.maxAmount !== undefined) {
      if (Number(req.body.minAmount) < Number(req.body.maxAmount) * 5) {
        return next(new ErrorHandler("Minimum purchase amount must be at least 5 times the maximum discount amount", 400));
      }
    }

    // Individual min/max amount validation
    if (req.body.minAmount !== undefined) {
      if (Number(req.body.minAmount) < 500 || Number(req.body.minAmount) > 100000) {
        return next(new ErrorHandler("Minimum purchase amount must be between ₹500 and ₹1,00,000", 400));
      }
    }

    if (req.body.maxAmount !== undefined) {
      if (Number(req.body.maxAmount) <= 0 || Number(req.body.maxAmount) > 5000) {
        return next(new ErrorHandler("Maximum discount amount must be between ₹1 and ₹5,000", 400));
      }
    }

    // Expiry date validation
    if (req.body.expiry) {
      if (isNaN(Date.parse(req.body.expiry))) {
        return next(new ErrorHandler("Valid expiry date is required", 400));
      }

      const expiryDate = new Date(req.body.expiry);
      const now = new Date();

      if (expiryDate <= now) {
        return next(new ErrorHandler("Expiry date must be in the future", 400));
      }

      const twoYearsFromNow = new Date();
      twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);

      if (expiryDate > twoYearsFromNow) {
        return next(new ErrorHandler("Expiry date cannot be more than 2 years in the future", 400));
      }
    }

    // Check for duplicate coupon code
    const existingCoupon = await Coupon.findOne({
      couponCode: {
        $regex: new RegExp(`^${couponCodeNormalized}$`, "i"),
      },
      _id: { $ne: req.params.id },
    });

    if (existingCoupon) {
      return next(
        new ErrorHandler("A coupon with this code already exists", 400)
      );
    }

    let updatedCoupon;
    try {
      updatedCoupon = await Coupon.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          couponCode: couponCodeNormalized,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    } catch (err) {
      if (err && err.code === 11000) {
        return next(new ErrorHandler("A coupon with this code already exists", 400));
      }
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return next(new ErrorHandler(messages.join(', '), 400));
      }
      throw err;
    }

    if (!updatedCoupon) {
      return next(new ErrorHandler("Failed to update the coupon", 500));
    }

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return next(new ErrorHandler("Coupon not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getActiveCoupons = async (req, res, next) => {
  try {
    const currentDate = new Date();

    const activeCoupons = await Coupon.find({ expiry: { $gt: currentDate } }).select(
      "couponCode title description discount minAmount maxAmount expiry"
    );

    res.status(200).json({
      success: true,
      activeCoupons,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCouponStatistics = async (req, res, next) => {
  try {
    const stats = await Coupon.aggregate([
      {
        $group: {
          _id: null,
          totalCoupons: { $sum: 1 },
          averageDiscount: { $avg: "$discount" },
          maxDiscount: { $max: "$discount" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      statistics: stats[0] || {},
    });
  } catch (error) {
    next(error);
  }
};

exports.validateCoupon = async (req, res, next) => {
  try {
    const { couponCode, userId, purchaseAmount, productIds } = req.body;

    if (!couponCode) {
      return next(new ErrorHandler("Coupon code is required", 400));
    }

    const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });

    if (!coupon) {
      return next(new ErrorHandler("Invalid coupon code", 404));
    }

    // Check expiry
    const currentDate = new Date();
    if (currentDate > coupon.expiry) {
      return next(new ErrorHandler("Coupon has expired", 400));
    }

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return next(new ErrorHandler("Coupon usage limit has been reached", 400));
    }

    // Check user-specific validations if userId is provided
    if (userId) {
      // Check if user has already used the coupon (per user limit)
      const userUsageCount = coupon.appliedUsers.filter(id => id.toString() === userId.toString()).length;
      if (userUsageCount >= coupon.perUserLimit) {
        return next(new ErrorHandler(`You have already used this coupon ${coupon.perUserLimit} time(s)`, 400));
      }

      // Check if user is in applicable users list (if list is not empty)
      if (coupon.applicableUsers.length > 0) {
        const isUserEligible = coupon.applicableUsers.some(id => id.toString() === userId.toString());
        if (!isUserEligible) {
          return next(new ErrorHandler("This coupon is not applicable for your account", 403));
        }
      }
    }

    // Check minimum purchase amount if provided
    if (purchaseAmount !== undefined && purchaseAmount !== null) {
      if (Number(purchaseAmount) < coupon.minAmount) {
        return next(new ErrorHandler(`Minimum purchase amount of ₹${coupon.minAmount} required to use this coupon`, 400));
      }
    }

    // Check product applicability if provided
    let isProductEligible = true;
    if (productIds && productIds.length > 0) {
      // If strict product/category rules exist, we must verify matches
      if (coupon.applicableProducts.length > 0 || coupon.applicableCategories.length > 0) {
        // Fetch products to check categories
        const products = await Product.find({ _id: { $in: productIds } });

        let hasMatch = false;

        // 1. Check Product ID Match
        if (coupon.applicableProducts.length > 0) {
          const productMatch = products.some(p => coupon.applicableProducts.includes(p._id.toString()));
          if (productMatch) hasMatch = true;
        }

        // 2. Check Category Match (if not already matched by ID)
        if (!hasMatch && coupon.applicableCategories.length > 0) {
          const categoryMatch = products.some(p => coupon.applicableCategories.includes(p.category));
          if (categoryMatch) hasMatch = true;
        }

        if (!hasMatch) {
          return next(new ErrorHandler("This coupon is not applicable for any items in your cart", 400));
        }
      }
    }

    // Calculate potential discount
    let potentialDiscount = 0;
    if (purchaseAmount) {
      potentialDiscount = Math.min(
        (Number(purchaseAmount) * coupon.discount) / 100,
        coupon.maxAmount
      );
    }

    res.status(200).json({
      success: true,
      message: "Coupon is valid",
      coupon: {
        code: coupon.couponCode,
        title: coupon.title,
        description: coupon.description,
        discount: coupon.discount,
        expiry: coupon.expiry,
        maxDiscount: coupon.maxAmount,
        minPurchase: coupon.minAmount,
        usageLimit: coupon.usageLimit,
        remainingUses: coupon.usageLimit ? coupon.usageLimit - coupon.usageCount : null,
        perUserLimit: coupon.perUserLimit,
        potentialDiscount: potentialDiscount || null
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.checkoutCoupons = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ error: "User ID and Product ID are required" });
  }

  try {
    const currentDate = new Date();
    const availableCoupons = await Coupon.find({
      applicableUsers: userId,
      applicableProducts: productId,
      appliedUsers: { $nin: [userId] },
      expiry: { $gt: currentDate },
      // isExpired: false,
    }).select(
      "couponCode title description discount minAmount maxAmount expiry"
    );

    return res.status(200).json(availableCoupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
