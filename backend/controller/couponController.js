const Coupon = require('../model/Coupon'); // Coupon model
const ErrorHandler = require('../utils/ErrorHandler');
const mongoose = require('mongoose');


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
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'applicableUserIds',
          foreignField: '_id',
          as: 'applicableUserDetails',
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'applicableProductIds',
          foreignField: '_id',
          as: 'applicableProductDetails',
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
                email: "$$user.email"
              },
            },
          },
          applicableProducts: {
            $map: {
              input: "$applicableProductDetails",
              as: "product",
              in: {
                id: "$$product._id",
                productName: "$$product.productName"
              },
            },
          },
          usersTaken: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    console.log(coupon, "coupon");

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
    const coupons = await Coupon.find();

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    next(error);
  }
};

// Get single coupon details (User and Admin)
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

// Create new coupon (Admin only)
exports.createCoupon = async (req, res, next) => {
  console.log('eached reached ')
  console.log(req.body, "body ")
  try {
    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ couponCode: req.body.couponCode });
    console.log(existingCoupon, 'existingCoupon')
    if (existingCoupon) {
      return next(new ErrorHandler("Coupon with this ID already exists", 400));
    }

    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

// Update coupon (Admin only)
exports.updateCoupon = async (req, res, next) => {
  try {
    console.log("reached reached reached reahed in coupon ")
    console.log(req.params, "paramd")
    // Check if coupon exists by ID
    const coupon = await Coupon.findById(req.params.id);

    console.log(coupon, 'coupons from cpoupons')
    if (!coupon) {
      return next(new ErrorHandler("Coupon not found", 404));
    }

    // Check if a coupon with the same code already exists before updating
    const existingCoupon = await Coupon.findOne({
      code: req.body.couponCode,
      _id: { $ne: req.params.id }, // Exclude the current coupon by its ID
    });

    if (existingCoupon) {
      return next(new ErrorHandler("Coupon with this code already exists", 400));
    }

    // Update the coupon if no duplicate is found
    const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      coupon: updatedCoupon,
    });
  } catch (error) {
    next(error);
  }
};


// Delete coupon (Admin only)
exports.deleteCoupon = async (req, res, next) => {
  try {
    console.log('reached inside coupon delete ')
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


// Get active coupons (User and Admin)
exports.getActiveCoupons = async (req, res, next) => {
    try {
      const currentDate = new Date();
  
      // Fetch coupons where Expiry date is greater than the current date
      const activeCoupons = await Coupon.find({ Expiry: { $gt: currentDate } });
  
      res.status(200).json({
        success: true,
        activeCoupons: activeCoupons.map(coupon => ({
          id: coupon._id,
          couponCode: coupon.CoupenCode,
          discount: coupon.Discount,
          expiry: coupon.Expiry,
        })),
      });
    } catch (error) {
      next(error);
    }
  };
  


  // Get coupon statistics (Admin only)
exports.getCouponStatistics = async (req, res, next) => {
    try {
      const stats = await Coupon.aggregate([
        {
          $group: {
            _id: null, // Group all documents
            totalCoupons: { $sum: 1 }, // Total coupons
            averageDiscount: { $avg: "$Discount" }, // Average discount
            maxDiscount: { $max: "$Discount" }, // Highest discount
          },
        },
      ]);
  
      res.status(200).json({
        success: true,
        statistics: stats[0] || {}, // If no coupons exist, return an empty object
      });
    } catch (error) {
      next(error);
    }
  };
  


  // Validate a coupon (User)
exports.validateCoupon = async (req, res, next) => {
    try {
      const { couponCode } = req.body;
  
      if (!couponCode) {
        return next(new ErrorHandler("Coupon code is required", 400));
      }
  
      const coupon = await Coupon.findOne({ CoupenCode: couponCode });
  
      if (!coupon) {
        return next(new ErrorHandler("Invalid coupon code", 404));
      }
  
      // Check if the coupon is expired
      const currentDate = new Date();
      if (currentDate > coupon.Expiry) {
        return next(new ErrorHandler("Coupon has expired", 400));
      }
  
      res.status(200).json({
        success: true,
        message: "Coupon is valid",
        discount: coupon.Discount,
        expiry: coupon.Expiry,
        maxDiscount: coupon.MaxDiscount,
        minPurchase: coupon.MinPurchase,
      });
    } catch (error) {
      next(error);
    }
  };
  



  exports.checkoutCoupons = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user; // Get userId from req.user, which was set in isAuthenticated middleware

    console.log(userId, productId, 'userId , productId');

    // Validate productId and userId
    if (!userId || !productId) {
        return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    try {
        // Fetch only the 'code' and '_id' (Mongoose ID) fields from coupons in the database
        const availableCoupons = await Coupon.find({
            applicableUsers: userId,
            applicableProducts: productId
        }).select('couponCode discount'); // Select only the 'code' and '_id' fields

        console.log(availableCoupons, 'available coupons ')
        return res.status(200).json(availableCoupons);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


  