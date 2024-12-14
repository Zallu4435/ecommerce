const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema(
  {
    productName: { 
      type: String,
      required: true,  // Make sure to add validation if needed
    },
    createdBy: { 
      type: String,
      required: false,  // Optional field
    },
    updatedBy: { 
      type: String,
      required: false,  // Optional field
    },
    description: { 
      type: String,
      required: false,  // Optional field
    },
    category: {
      type: String,
      required: true,  // Assuming it's a required field
    },
    brand: { 
      type: String,
      required: false,  // Optional field
    },
    warranty: { 
      type: String,
      required: false,  // Optional field
    },
    returnPolicy: { 
      type: String,
      required: false,  // Optional field
    },
    originalPrice: { 
      type: Number,
      required: true,  // Assuming it's a required field
    },
    status: { 
      type: String,
      required: true,  // Assuming it's a required field
    },
    colorOption: [
      { 
        type: String,
        required: false,  // Optional field
      }
    ],
    images: [
      { 
        type: String,
        required: false,  // Optional field
      }
    ],
    sizeOption: [
      { 
        type: String,
        required: false,  // Optional field
      }
    ],
    stock: { 
      type: Number,
      required: true,  // Assuming it's a required field
    },
    offerPercentage: { 
      type: mongoose.Schema.Types.Decimal128,
      required: false,  // Optional field
    },
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model('Products', ProductsSchema);

module.exports = Products;
