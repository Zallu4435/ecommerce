const Order = require("../model/Orders");
const moment = require("moment");

exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const dateRange = req.query.dateRange || "This Week";
    const orderStatusFilter = req.query.orderStatusFilter;

    let startDate, endDate;

    if (dateRange === "Custom") {
      const startDateStr = req.query.startDate;
      const endDateStr = req.query.endDate;

      if (!startDateStr || !endDateStr) {
        return res.status(400).json({
          error: "Start date and end date are required for custom range",
        });
      }

      startDate = moment(startDateStr).startOf("day");
      endDate = moment(endDateStr).endOf("day");

      if (!startDate.isValid() || !endDate.isValid()) {
        return res.status(400).json({
          error: "Invalid date format",
        });
      }
    } else {
      switch (dateRange) {
        case "Today":
          startDate = moment().startOf("day");
          endDate = moment().endOf("day");
          break;
        case "This Week":
          startDate = moment().startOf("week");
          endDate = moment().endOf("week");
          break;
        case "This Month":
          startDate = moment().startOf("month");
          endDate = moment().endOf("month");
          break;
        case "This Year":
          startDate = moment().startOf("year");
          endDate = moment().endOf("year");
          break;
        default:
          startDate = moment().startOf("week");
          endDate = moment().endOf("week");
      }
    }

    const matchStage = {
      $match: {
        createdAt: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
        },
      },
    };

    if (orderStatusFilter) {
      matchStage.$match["items.Status"] = orderStatusFilter;
    }

    const orders = await Order.aggregate([
      matchStage,
      {
        $lookup: {
          from: "users",
          localField: "UserId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $lookup: {
          from: "payments", 
          localField: "_id",
          foreignField: "OrderId",
          as: "paymentDetails",
        },
      },
      {
        $unwind: { path: "$customerDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$paymentDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          customer: "$customerDetails.username",
          total: "$TotalAmount",
          discountAmount: "$CouponDiscount",
          status: {
            $cond: {
              if: { $isArray: "$items" },
              then: { $arrayElemAt: ["$items.Status", 0] },
              else: "Unknown",
            },
          },
          quantity: {
            $cond: {
              if: { $isArray: "$items" },
              then: { $sum: "$items.Quantity" },
              else: 0,
            },
          },
          paymentType: "$paymentDetails.method",
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },
    ]);

    const totalOrders = await Order.countDocuments(matchStage.$match);
    const totalPages = Math.ceil(totalOrders / pageSize);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          totalOrders,
          totalPages,
          currentPage: page,
          pageSize,
        },
        dateRange: {
          start: startDate.format("YYYY-MM-DD"),
          end: endDate.format("YYYY-MM-DD"),
          type: dateRange,
        },
      },
    });
  } catch (err) {
    console.error("Error in getOrders:", err);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

exports.getSalesOverview = async (req, res) => {
  try {
    const totalRevenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$TotalAmount" } } },
    ]);
    const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

    const totalDiscountData = await Order.aggregate([
      { $group: { _id: null, CouponDiscount: { $sum: "$CouponDiscount" } } },
    ]);
    const couponDiscount = totalDiscountData[0]?.CouponDiscount || 0;

    const totalOrders = await Order.countDocuments();

    const averageOrderValue =
      totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    res.json({
      totalRevenue,
      couponDiscount,
      totalOrders,
      averageOrderValue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.ProductId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.productName",
          totalSold: { $sum: "$items.Quantity" },
          totalRevenue: {
            $sum: {
              $multiply: ["$items.Quantity", "$productDetails.offerPrice"],
            },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json(topProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getTopSellingCategories = async (req, res) => {
  try {
    const topCategories = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.ProductId",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          totalItemsSold: { $sum: "$items.Quantity" },
          totalRevenue: {
            $sum: {
              $multiply: ["$items.Quantity", "$productDetails.offerPrice"],
            },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          totalItemsSold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.status(200).json(topCategories);
  } catch (error) {
    console.error("Error fetching top-selling categories:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getTopSellingBrands = async (req, res) => {
  try {
    const topBrands = await Order.aggregate([
      { $unwind: "$items" },

      {
        $lookup: {
          from: "products",
          localField: "items.ProductId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.brand",
          totalItemsSold: { $sum: "$items.Quantity" },
          totalRevenue: {
            $sum: {
              $multiply: ["$items.Quantity", "$productDetails.offerPrice"],
            },
          },
        },
      },
      { $sort: { totalItemsSold: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          brandName: "$_id",
          totalItemsSold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.status(200).json(topBrands);
  } catch (error) {
    console.error("Error fetching top-selling brands:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
