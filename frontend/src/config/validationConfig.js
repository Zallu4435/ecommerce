export const couponsFormsField = [
  { name: "couponCode", label: "Coupon Code", type: "text" },
  { name: "title", label: "Coupon Title", type: "text" },
  { name: "discount", label: "Discount Percentage (1-70%)", type: "number" },
  { name: "minAmount", label: "Minimum Purchase Amount (₹500-₹1,00,000)", type: "number" },
  { name: "maxAmount", label: "Maximum Discount Amount (₹1-₹5,000)", type: "number" },
  { name: "expiry", label: "Expiry Date", type: "date" },
  { name: "usageLimit", label: "Total Usage Limit (Optional)", type: "number", placeholder: "Leave empty for unlimited" },
  { name: "perUserLimit", label: "Per User Limit (1-5)", type: "number", min: 1, max: 5 },
];
