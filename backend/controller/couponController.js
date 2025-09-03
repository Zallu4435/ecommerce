const Coupon = require("../model/Coupon");
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
    if (!req.body.couponCode || req.body.couponCode.trim() === "") {
      return next(new ErrorHandler("Coupon code is required", 400));
    }

    if (!req.body.title || req.body.title.trim() === "") {
      return next(new ErrorHandler("Coupon title is required", 400));
    }

    if (!req.body.description || req.body.description.trim() === "") {
      return next(new ErrorHandler("Coupon description is required", 400));
    }

    if (
      !req.body.discount ||
      isNaN(req.body.discount) ||
      Number(req.body.discount) <= 0 ||
      Number(req.body.discount) > 100
    ) {
      return next(new ErrorHandler("Discount must be between 1 and 100", 400));
    }

    if (
      !req.body.expiry ||
      isNaN(Date.parse(req.body.expiry)) ||
      Date.parse(req.body.expiry) <= Date.now()
    ) {
      return next(
        new ErrorHandler("Expiry date must be a valid future date", 400)
      );
    }

    const couponCodeNormalized = req.body.couponCode.trim();

    const existingCoupon = await Coupon.findOne({
      couponCode: { $regex: new RegExp(`^${couponCodeNormalized}$`, "i") },
    });

    if (existingCoupon) {
      return next(
        new ErrorHandler(
          "A coupon with this code already exists, case-insensitive",
          400
        )
      );
    }

    let coupon;
    try {
      coupon = await Coupon.create({ ...req.body, couponCode: couponCodeNormalized });
    } catch (err) {
      if (err && err.code === 11000) {
        return next(new ErrorHandler("A coupon with this code already exists", 400));
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

    if (!req.body.couponCode || req.body.couponCode.trim() === "") {
      return next(new ErrorHandler("Coupon code is required", 400));
    }

    if (!req.body.title || req.body.title.trim() === "") {
      return next(new ErrorHandler("Coupon title is required", 400));
    }

    const existingCoupon = await Coupon.findOne({
      couponCode: {
        $regex: new RegExp(`^${req.body.couponCode.trim()}$`, "i"),
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
          couponCode: req.body.couponCode.trim(),
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
    const { couponCode } = req.body;

    if (!couponCode) {
      return next(new ErrorHandler("Coupon code is required", 400));
    }

    const coupon = await Coupon.findOne({ couponCode });

    if (!coupon) {
      return next(new ErrorHandler("Invalid coupon code", 404));
    }

    const currentDate = new Date();
    if (currentDate > coupon.expiry) {
      return next(new ErrorHandler("Coupon has expired", 400));
    }

    res.status(200).json({
      success: true,
      message: "Coupon is valid",
      discount: coupon.discount,
      expiry: coupon.expiry,
      maxDiscount: coupon.maxAmount,
      minPurchase: coupon.minAmount,
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
