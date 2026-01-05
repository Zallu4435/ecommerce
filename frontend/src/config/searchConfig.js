export const headerToFieldMap = {
  users: {
    Username: "username",
    Email: "email",
    Role: "role",
    "Join Date": "joinDate",
    Actions: "actions",
  },
  categories: {
    "Category Name": "categoryName",
    Description: "categoryDescription",
    "Active Offer": "offerName",
    "Created At": "createdAt",
    Actions: "actions",
  },
  orders: {
    Username: "username",
    "Total Orders": "ordersCount",
    "Total Amount": "totalAmount",
    "Last Order Date": "lastOrderDate",
    Status: "lastOrderStatus",
    Actions: "actions",
  },
  coupons: {
    Code: "couponCode",
    Title: "title",
    Discount: "discount",
    "Valid Until": "expiry",
    Actions: "actions",
  },
  products: {
    "Product Name": "productName",
    Category: "category",
    Brand: "brand",
    "Base Price": "basePrice",
    "Base Offer Price": "baseOfferPrice",
    Actions: "actions",
  },
};
