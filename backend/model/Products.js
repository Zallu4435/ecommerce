const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema(
  {
    name: { 
          type: String 
      },
    CreatedBy: { 
        type: String 
    },
    UpdatedBy: { 
        type: String 
    },
    Description: { 
        type: String 
    },
    category: {
        type: String
    },
    Brand: { 
        type: String 
    },
    Warrenty: { 
        type: String 
    },
    ReturnPolicy: { 
        type: String 
    },
    OriginalPrice: { 
        type: Number 
    },
    Status: { 
        type: String 
    },
    ColorOption: [
        { 
            type: String 
        }
    ],
    Images: [
        { 
            type: String 
        }
    ],
    SizeOption: [
        { 
            type: String 
        }
    ],
    Stock: { 
        type: Number 
    },
    OfferPercentage: { 
        type: mongoose.Schema.Types.Decimal128 
    },
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model('Products', ProductsSchema);

module.exports = Products;
