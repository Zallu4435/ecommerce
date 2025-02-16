export const productsData = [
    {
      id: 1,
      name: "Smartphone",
      price: 299.99,
      originalPrice: 499.99,
      image: "/images/smartphone.jpg",
      category: "electronics",
      size: "M", 
      color: "Black", 
    },
    {
      id: 2,
      name: "T-shirt",
      price: 19.99,
      originalPrice: 39.99,
      image: "/images/tshirt.jpg",
      category: "clothing",
      size: "L", 
      color: "Red", 
    },
    {
      id: 3,
      name: "Laptop",
      price: 799.99,
      originalPrice: 999.99,
      image: "/images/laptop.jpg",
      category: "electronics",
      size: "S", 
      color: "Silver", 
    },
    {
      id: 4,
      name: "Jacket",
      price: 59.99,
      originalPrice: 99.99,
      image: "/images/jacket.jpg",
      category: "clothing",
      size: "M", 
      color: "Black", 
    },
  ];
  

  export const orders = [
    {
      id: 1001,
      userId: 'U12345',
      date: '2024-12-01',
      productName: 'Wireless Bluetooth Headphones',
      quantity: 1,
      pricePerUnit: 79.99,
      totalPrice: 79.99,
      status: 'Delivered',
      deliveryDate: '2024-12-05',
      paymentMethod: 'Credit Card',
      shippingAddress: '123 Main St, NY, USA',
    },
    {
      id: 1002,
      userId: 'U12345',
      date: '2024-11-28',
      productName: 'Laptop Stand',
      quantity: 2,
      pricePerUnit: 25.0,
      totalPrice: 50.0,
      status: 'Pending',
      deliveryDate: null,
      paymentMethod: 'PayPal',
      shippingAddress: '456 Elm St, NY, USA',
    },
  ]