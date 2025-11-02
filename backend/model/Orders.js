const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema(
  {
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assuming a User model
    AddressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    items: [
      {
        Price: {
          type: Number,
        },
        ProductId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        Quantity: {
          type: Number,
        },
        RefundStatus: {
          type: String,
          enum: ["Not Initiated", "Pending", "Refunded", "Failed"],
          default: "Not Initiated",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now, 
        },
        Status: {
          type: String,
          default: "Pending",
        },
        reason: {
          type: String,
          default: "",
        },
      },
    ],
    CouponDiscount: { type: Number, default: 0 }, 
    TotalAmount: { type: Number, required: true }, 
    Subtotal: { type: Number, required: true }, 
    RefundAmount: { type: Number, default: 0 },
    CoupenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupen",
    },
    TotalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, 
  }
);

OrdersSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    item.updatedAt = Date.now();
  });
  next();
});

const Orders = mongoose.model("Orders", OrdersSchema);

module.exports = Orders;
