  export const headerToFieldMap = {
    users: {
      'Username': 'username',
      'Email': 'email',
      'Role': 'role',
      'Join Date': 'joinDate',
      'Actions': 'actions',  // Assuming 'actions' is a special field
    },
    categories: {
      'Category Name': 'categoryName',
      'Product Count': 'productCount',
      'Created At': 'createdAt',
      'Actions': 'actions',
    },
    orders: {
      'Username': 'username',
      'Total Orders': 'totalOrders',
      'Total Amount': 'totalAmount',
      'Last Order Date': 'lastOrderDate',
      'Status': 'status',
      'Actions': 'actions',
    },
    coupons: {
      'Coupon Code': 'couponCode',
      'Discount Value': 'discountValue',
      'Expiry Date': 'expiryDate',
      'Max Discount': 'maxDiscount',
      'Min Purchase': 'minPurchase',
      'Actions': 'actions',
    },
    products: {
      'Product Name': 'productName',
      'Category': 'category',
      'Brand': 'brand',
      'Original Price': 'originalPrice',
      'Offer Price': 'offerPrice',
      'Actions': 'actions',
    },
  };