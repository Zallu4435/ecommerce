const Order = require("../model/Orders");
const moment = require("moment");

const getDateMatchStage = (req) => {
  const dateRange = req.query.dateRange || "This Week";
  let startDate, endDate;

  if (dateRange === "Custom") {
    const startDateStr = req.query.startDate;
    const endDateStr = req.query.endDate;

    if (!startDateStr || !endDateStr) {
      throw new Error("Start date and end date are required for custom range");
    }

    startDate = moment(startDateStr).startOf("day");
    endDate = moment(endDateStr).endOf("day");

    if (!startDate.isValid() || !endDate.isValid()) {
      throw new Error("Invalid date format");
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

  return {
    $match: {
      createdAt: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
      "items.Status": { $ne: "Cancelled" } // Exclude cancelled items from sales stats? Generally yes, but let's keep consistent with existing simple logic first.
      // Actually, existing getOrders filters by items.Status if provided, but default shows all.
      // For SALES OVERVIEW, you definitely do NOT want to count Cancelled orders as Revenue.
      // However, existing "lifetime" code just summed TotalAmount. 
      // Let's stick to the DATE FILTER ONLY first to avoid changing business logic scope unexpectedly.
      // But "Real World" typically excludes cancelled. 
      // I will stick to just date match for now to match exactly what getOrders does (minus specific status filter).
    },
    dates: { start: startDate, end: endDate }
  };
};

exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const orderStatusFilter = req.query.orderStatusFilter;

    // Check if limit is explicitly passed. '0' means all.
    let limitOption = null;
    if (req.query.limit !== undefined) {
      limitOption = parseInt(req.query.limit);
    }

    const skip = (page - 1) * pageSize;

    let matchStageData;
    try {
      matchStageData = getDateMatchStage(req);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const { $match, dates } = matchStageData;
    const matchStage = { $match }; // Re-wrap to avoid mutating shared object if needed, though getDateMatchStage returns new.

    if (orderStatusFilter) {
      matchStage.$match["items.Status"] = orderStatusFilter;
    }

    const pipeline = [
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
          discountAmount: { $subtract: ["$Subtotal", "$TotalAmount"] },
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
    ];

    // Apply pagination ONLY if limit is NOT 0 (or not all)
    // If limitOption is null, use pagination (default behavior)
    // If limitOption is > 0, use pagination-like behavior or just limit? usually limit implies page 1.
    // If limitOption is 0, NO skip, NO limit.
    if (limitOption === 0) {
      // Fetch ALL, do not skip or limit
    } else {
      // Pagination logic
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: pageSize });
    }

    const orders = await Order.aggregate(pipeline);

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
          start: dates.start.format("YYYY-MM-DD"),
          end: dates.end.format("YYYY-MM-DD"),
          type: req.query.dateRange || "This Week",
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
    let matchStageData;
    try {
      matchStageData = getDateMatchStage(req);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const { $match } = matchStageData;

    const totalRevenueData = await Order.aggregate([
      { $match },
      { $group: { _id: null, totalRevenue: { $sum: "$TotalAmount" } } },
    ]);
    const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

    const totalDiscountData = await Order.aggregate([
      { $match },
      {
        $group: {
          _id: null,
          CouponDiscount: { $sum: { $subtract: ["$Subtotal", "$TotalAmount"] } }
        }
      },
    ]);
    const couponDiscount = totalDiscountData[0]?.CouponDiscount || 0;

    const totalOrders = await Order.countDocuments($match);

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
    let matchStageData;
    try {
      matchStageData = getDateMatchStage(req);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const { $match } = matchStageData;

    let limit = 5;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    const pipeline = [
      { $match },
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
            $sum: "$items.itemTotal",
          },
        },
      },
      { $sort: { totalSold: -1 } },
    ];

    if (limit > 0) {
      pipeline.push({ $limit: limit });
    }

    const topProducts = await Order.aggregate(pipeline);

    res.json(topProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getTopSellingCategories = async (req, res) => {
  try {
    let matchStageData;
    try {
      matchStageData = getDateMatchStage(req);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const { $match } = matchStageData;

    const topCategories = await Order.aggregate([
      { $match },
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
            $sum: "$items.itemTotal",
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
    let matchStageData;
    try {
      matchStageData = getDateMatchStage(req);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    const { $match } = matchStageData;

    const topBrands = await Order.aggregate([
      { $match },
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
            $sum: "$items.itemTotal",
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
