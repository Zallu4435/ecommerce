const Order = require("../model/Orders");
const Product = require("../model/Products");
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
        $unwind: { path: "$customerDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          customer: "$customerDetails.username",
          total: "$TotalAmount",
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

    const totalOrders = await Order.countDocuments();

    const averageOrderValue =
      totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    const totalVisits = 500;
    const conversionRate =
      totalVisits > 0 ? ((totalOrders / totalVisits) * 100).toFixed(2) : 0;

    res.json({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      conversionRate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const saleId = req.params.id;
    const saleDetails = await Order.findById(saleId);
    if (!saleDetails) {
      return res.status(404).json({ error: "Sale not found" });
    }

    res.json(saleDetails);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.updateSaleStatus = async (req, res) => {
  try {
    const { saleId, newStatus } = req.body; // Assuming you send saleId and status to update

    const updatedSale = await Order.findByIdAndUpdate(
      saleId,
      { status: newStatus }, // Update sale status
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    res.json(updatedSale);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Fetch top-selling products (sales analysis)
exports.getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      // Unwind the items array to process each product in an order separately
      { $unwind: "$items" },

      // Lookup product details from the products collection
      {
        $lookup: {
          from: "products", // The name of the products collection
          localField: "items.ProductId", // Match the ProductId in items
          foreignField: "_id", // Match with the _id field in the products collection
          as: "productDetails",
        },
      },

      // Unwind the productDetails array to simplify the structure
      { $unwind: "$productDetails" },

      // Group by product name and sum the quantities sold
      {
        $group: {
          _id: "$productDetails.productName", // Group by product name
          totalSold: { $sum: "$items.Quantity" }, // Sum up the quantities
          totalRevenue: {
            $sum: { $multiply: ["$items.Quantity", "$productDetails.price"] },
          }, // Calculate total revenue
        },
      },

      // Sort by totalSold in descending order
      { $sort: { totalSold: -1 } },

      // Limit to top 5 products
      { $limit: 5 },
    ]);

    console.log(topProducts, "topProducts");
    res.json(topProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
