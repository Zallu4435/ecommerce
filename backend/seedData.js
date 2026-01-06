
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "config/.env"),
});

const Categories = require("./model/Categories");
const Products = require("./model/Products");
const ProductVariant = require("./model/ProductVariants");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const productList = {
    Men: [
        "Classic White T-Shirt",
        "Slim Fit Denim Jeans",
        "Leather Biker Jacket",
        "Casual Chino Shorts",
        "Oxford Button-Down Shirt"
    ],
    Women: [
        "Floral Summer Dress",
        "High-Waist Skinny Jeans",
        "Oversized Knitted Sweater",
        "Elegant Evening Gown",
        "Pleated Midi Skirt"
    ],
    Child: [
        "Kids Graphic T-Shirt",
        "Comfortable Joggers",
        "Colorful Raincoat",
        "Denim Dungarees",
        "Striped Cotton Pajamas"
    ]
};

const seedData = async () => {
    await connectDatabase();

    try {
        // Cleanup previous test data
        console.log("Cleaning up old test products...");
        // Removing the old "Test" products I created earlier
        await Products.deleteMany({ productName: { $regex: /Test$/ } });

        // Also remove any existing products from our new list to avoid duplicates if re-run
        const allNewNames = Object.values(productList).flat();

        // Find IDs of products to be deleted to clean up variants
        const productsToDelete = await Products.find({
            $or: [
                { productName: { $regex: /Test$/ } },
                { productName: { $in: allNewNames } }
            ]
        });

        const productIdsToDelete = productsToDelete.map(p => p._id);
        if (productIdsToDelete.length > 0) {
            await ProductVariant.deleteMany({ productId: { $in: productIdsToDelete } });
            await Products.deleteMany({ _id: { $in: productIdsToDelete } });
            console.log(`Deleted ${productsToDelete.length} old products and their variants.`);
        }

        const categoriesData = [
            { name: "Men", description: "Clothing and accessories for men" },
            { name: "Women", description: "Clothing and accessories for women" },
            { name: "Child", description: "Clothing and accessories for children" },
        ];

        for (const catData of categoriesData) {
            let category = await Categories.findOne({ categoryName: catData.name });
            if (!category) {
                category = await Categories.create({
                    categoryName: catData.name,
                    categoryDescription: catData.description,
                    isOfferActive: true,
                    categoryOffer: 10,
                    offerName: "Welcome Offer",
                });
                console.log(`Created category: ${category.categoryName}`);
            }

            // Create distinct products
            const specificProducts = productList[catData.name];

            for (let i = 0; i < specificProducts.length; i++) {
                const productName = specificProducts[i];
                const dummyImageText = productName.replace(/\s+/g, "+");

                const product = await Products.create({
                    productName: productName,
                    description: `This is a premium ${productName} from our ${catData.name} collection. Features high-quality materials and modern design.`,
                    category: catData.name,
                    brand: "FashionBrand",
                    basePrice: Math.floor(Math.random() * (2000 - 500 + 1) + 500), // Random price between 500 and 2000
                    baseOfferPrice: 0,
                    image: `https://via.placeholder.com/400x500?text=${dummyImageText}`,
                    totalStock: 100,
                    availableColors: ["Black", "White", "Blue", "Red"],
                    availableSizes: ["S", "M", "L", "XL"],
                    hasVariants: true,
                    status: "active",
                });

                // Update offer price (approx 10% off)
                product.baseOfferPrice = Math.floor(product.basePrice * 0.9);
                await product.save();

                console.log(`Created product: ${product.productName}`);

                // Create variants
                const colors = ["Black", "White"];
                const sizes = ["M", "L"];

                for (const color of colors) {
                    for (const size of sizes) {
                        await ProductVariant.create({
                            productId: product._id,
                            sku: `SKU-${product._id.toString().slice(-4)}-${color.substring(0, 1)}-${size}`,
                            color: color,
                            size: size,
                            stockQuantity: 25,
                            price: product.basePrice,
                            offerPrice: product.baseOfferPrice,
                            isActive: true,
                            image: `https://via.placeholder.com/400x500?text=${dummyImageText}+${color}`
                        });
                    }
                }
            }
        }

        console.log("Seeding completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
