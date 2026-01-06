const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema(
  {
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    AddressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    shippingAddress: {
      name: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },

    // Order-level status
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Partially Shipped",
        "Shipped",
        "Partially Delivered",
        "Delivered",
        "Partially Cancelled",
        "Cancelled",
        "Partially Returned",
        "Returned",
        "Failed"
      ],
      default: "Pending",
    },

    // Payment information
    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay", "Card", "Wallet"],
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded", "Partially Refunded"],
      default: "Pending",
    },

    // Items in the order
    items: [
      {
        ProductId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        productName: String,
        productImage: String,
        color: String,
        size: String,
        gender: String,
        Price: {
          type: Number,
          required: true,
        },
        Quantity: {
          type: Number,
          required: true,
        },
        itemTotal: {
          type: Number,
          required: true,
        },

        // Item-level status
        Status: {
          type: String,
          enum: [
            "Pending",
            "Confirmed",
            "Processing",
            "Packed",
            "Shipped",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
            "Return Requested",
            "Returned",
            "Refunded",
            "Payment Failed"
          ],
          default: "Pending",
        },

        // Tracking information
        trackingNumber: String,

        // Timestamps for item
        confirmedAt: Date,
        shippedAt: Date,
        deliveredAt: Date,

        // Cancellation
        cancelledAt: Date,
        cancellationReason: String,

        // Return
        returnRequestedAt: Date,
        returnedAt: Date,
        returnReason: String,

        // Refund
        RefundStatus: {
          type: String,
          enum: ["Not Initiated", "Pending", "Refunded", "Failed"],
          default: "Not Initiated",
        },
        refundAmount: {
          type: Number,
          default: 0,
        },
        refundedAt: Date,

        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Pricing
    Subtotal: { type: Number, required: true },
    CouponDiscount: { type: Number, default: 0 },
    TotalAmount: { type: Number, required: true },

    // Coupon
    CoupenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupen",
    },

    // Refund tracking
    RefundAmount: { type: Number, default: 0 },

    // Delivery
    expectedDeliveryDate: Date,
    actualDeliveryDate: Date,

    // Notes
    orderNotes: String,
  },
  {
    timestamps: true,
  }
);

// Helper method to calculate order status based on items
OrdersSchema.methods.calculateOrderStatus = function () {
  if (!this.items || this.items.length === 0) {
    return "Pending";
  }

  const statuses = this.items.map((item) => item.Status);
  const uniqueStatuses = [...new Set(statuses)];

  // All items have the same status
  if (uniqueStatuses.length === 1) {
    const status = uniqueStatuses[0];
    if (status === "Delivered") return "Delivered";
    if (status === "Cancelled") return "Cancelled";
    if (status === "Returned") return "Returned";
    if (status === "Shipped") return "Shipped";
    if (status === "Processing" || status === "Packed") return "Processing";
    if (status === "Confirmed") return "Confirmed";
    return "Pending";
  }

  // Mixed statuses
  const hasDelivered = statuses.includes("Delivered");
  const hasCancelled = statuses.includes("Cancelled");
  const hasReturned = statuses.includes("Returned");
  const hasShipped = statuses.includes("Shipped") || statuses.includes("Out for Delivery");

  if (hasDelivered && hasCancelled) return "Partially Cancelled";
  if (hasDelivered && hasReturned) return "Partially Returned";
  if (hasDelivered) return "Partially Delivered";
  if (hasShipped) return "Partially Shipped";
  if (hasCancelled && statuses.every(s => s === "Cancelled" || s === "Pending")) return "Partially Cancelled";

  return "Processing";
};

// Pre-save middleware
OrdersSchema.pre("save", function (next) {
  // Update item timestamps
  this.items.forEach((item) => {
    item.updatedAt = Date.now();

    // Set timestamps based on status changes
    if (item.Status === "Delivered" && !item.deliveredAt) {
      item.deliveredAt = Date.now();
    }
    if (item.Status === "Shipped" && !item.shippedAt) {
      item.shippedAt = Date.now();
    }
    if (item.Status === "Cancelled" && !item.cancelledAt) {
      item.cancelledAt = Date.now();
    }
    if (item.Status === "Returned" && !item.returnedAt) {
      item.returnedAt = Date.now();
    }
    if (item.Status === "Confirmed" && !item.confirmedAt) {
      item.confirmedAt = Date.now();
    }
  });

  // Auto-calculate order status
  this.orderStatus = this.calculateOrderStatus();

  next();
});

const Orders = mongoose.model("Orders", OrdersSchema);

module.exports = Orders;
