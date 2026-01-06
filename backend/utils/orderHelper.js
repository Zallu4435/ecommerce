const Product = require("../model/Products");
const ProductVariant = require("../model/ProductVariants");
const Coupon = require("../model/Coupon");
const Wallet = require("../model/Wallet");
const Transaction = require("../model/WalletTransaction");
const Payment = require("../model/Payment");
const Cart = require("../model/Cart");
const crypto = require("crypto");

/**
 * Decrease stock quantity after successful payment
 * @param {Array} orderItems - List of items in the order
 */
const User = require("../model/User");

/**
 * Decrease stock quantity after successful payment
 * @param {Array} orderItems - List of items in the order
 */
const decreaseStockForOrder = async (orderItems) => {
    console.log('📉 [STOCK DEDUCT] Deducting stock for', orderItems.length, 'items');
    for (let item of orderItems) {
        const pId = item.ProductId || item.productId;
        const qty = Number(item.Quantity || item.quantity || 0);

        console.log(`🔍 [STOCK DEDUCT] Item: ${item.productName || pId}, Qty: ${qty}, Variant: ${item.color}/${item.size}`);

        const product = await Product.findById(pId);
        if (product) {
            // Decrease Total Stock
            const oldTotal = product.totalStock;
            product.totalStock = (product.totalStock || 0) - qty;
            console.log(`📦 [STOCK DEDUCT] Product ${product.productName}: totalStock ${oldTotal} -> ${product.totalStock}`);

            // Decrease Variant Stock if variant details exist
            if (item.color && item.size) {
                let variantQuery = {
                    productId: product._id,
                    color: item.color.trim().toLowerCase(),
                    size: item.size.trim().toUpperCase()
                };

                if (item.gender) {
                    variantQuery.gender = item.gender.charAt(0).toUpperCase() + item.gender.slice(1).toLowerCase();
                }

                console.log('🔦 [STOCK DEDUCT] Variant Query:', JSON.stringify(variantQuery));

                const variant = await ProductVariant.findOne(variantQuery);
                if (variant) {
                    const oldVariantStock = variant.stockQuantity;
                    variant.stockQuantity -= qty;
                    await variant.save();
                    console.log(`✅ [STOCK DEDUCT] Variant found! stockQuantity ${oldVariantStock} -> ${variant.stockQuantity}`);
                } else {
                    console.log('❌ [STOCK DEDUCT] Variant NOT FOUND. Possible causes: wrong color/size/gender or productId mismatch.');
                    // Extra debug: list all variants for this product
                    const allVariants = await ProductVariant.find({ productId: product._id });
                    console.log(`📋 [STOCK DEDUCT] Available variants for this product (${allVariants.length}):`);
                    allVariants.forEach(v => {
                        console.log(`   - Color: "${v.color}", Size: "${v.size}", Gender: "${v.gender}", Stock: ${v.stockQuantity}`);
                    });
                }
            } else {
                console.log('⚠️ [STOCK DEDUCT] No variant details (color/size) for this item.');
            }
            await product.save();
        } else {
            console.log('❌ [STOCK DEDUCT] Product not found for ID:', pId);
        }
    }
};

/**
 * Check stock availability and deduct it in one go (with validation)
 * @param {Array} orderItems 
 */
const ensureStockAndDeductForOrder = async (orderItems) => {
    console.log('🛡️ [STOCK VALIDATE] Starting validation and deduction for', orderItems.length, 'items');
    for (const item of orderItems) {
        const pId = item.ProductId || item.productId;
        const qty = Number(item.Quantity || item.quantity || 0);

        const product = await Product.findById(pId);
        if (!product) throw new Error(`Product not found: ${pId}`);

        console.log(`🔍 [STOCK VALIDATE] Checking ${product.productName}. Required: ${qty}, Available: ${product.totalStock}`);

        if (product.totalStock < qty) {
            throw new Error(`Insufficient total stock for ${product.productName}. Required: ${qty}, Available: ${product.totalStock}`);
        }

        // Handle variants
        if (item.color && item.size) {
            let variantQuery = {
                productId: product._id,
                color: item.color.trim().toLowerCase(),
                size: item.size.trim().toUpperCase()
            };

            if (item.gender) {
                variantQuery.gender = item.gender.charAt(0).toUpperCase() + item.gender.slice(1).toLowerCase();
            }

            console.log('🔦 [STOCK VALIDATE] Variant Query:', JSON.stringify(variantQuery));

            const variant = await ProductVariant.findOne(variantQuery);
            if (!variant) {
                console.log('❌ [STOCK VALIDATE] Variant NOT FOUND for query. Available variants follow:');
                const allV = await ProductVariant.find({ productId: product._id });
                allV.forEach(v => console.log(`   - ${v.color}/${v.size}/${v.gender} (Stock: ${v.stockQuantity})`));
                throw new Error(`Variant not found for ${product.productName} (${item.color}/${item.size})`);
            }

            if (variant.stockQuantity < qty) {
                throw new Error(`Insufficient stock for variant ${product.productName} (${item.color}/${item.size}). Required: ${qty}, Available: ${variant.stockQuantity}`);
            }

            variant.stockQuantity -= qty;
            await variant.save();
            console.log(`✅ [STOCK VALIDATE] Variant stock deducted. New qty: ${variant.stockQuantity}`);
        }

        product.totalStock -= qty;
        await product.save();
        console.log(`✅ [STOCK VALIDATE] Product total stock deducted. New total: ${product.totalStock}`);
    }
};

/**
 * Increase stock quantity (return to inventory)
 * @param {Array} orderItems - List of items to return to stock
 */
const increaseStockForOrder = async (orderItems) => {
    for (let item of orderItems) {
        const product = await Product.findById(item.ProductId);
        if (product) {
            // Restore Total Stock
            if (product.totalStock !== undefined) {
                product.totalStock += item.Quantity;
            } else {
                product.totalStock = (product.totalStock || 0) + item.Quantity;
            }

            // Restore Variant Stock if variant details exist
            if (item.color && item.size) {
                let variantQuery = {
                    productId: product._id,
                    color: item.color.toLowerCase(),
                    size: item.size.toUpperCase()
                };

                if (item.gender) {
                    variantQuery.gender = item.gender.charAt(0).toUpperCase() + item.gender.slice(1).toLowerCase();
                }

                const variant = await ProductVariant.findOne(variantQuery);
                if (variant) {
                    variant.stockQuantity += item.Quantity;
                    await variant.save();
                }
            }
            await product.save();
        }
    }
};

/**
 * Validate and apply coupon
 * @param {string} couponCode 
 * @param {string} userId 
 * @param {number} purchaseAmount 
 * @param {Array} productIds 
 */
/**
 * Validate and apply coupon
 * Logic: Calculates discount based on eligible items (Category/Product matches)
 * @param {string} couponCode 
 * @param {string} userId 
 * @param {Array} orderItems - Array of order items with { Price, Quantity, ProductId, category }
 */
const validateAndApplyCoupon = async (couponCode, userId, orderItems = [], session = null) => {
    if (!couponCode) return { coupon: null, discountAmount: 0 };

    const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
    if (!coupon) {
        throw new Error("Invalid coupon code.");
    }

    const currentDate = new Date();
    if (currentDate > coupon.expiry) {
        throw new Error("This coupon has expired.");
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
        throw new Error("This coupon has reached its usage limit.");
    }

    const userUsageCount = coupon.appliedUsers.filter(id => id.toString() === userId.toString()).length;
    if (userUsageCount >= coupon.perUserLimit) {
        throw new Error(`You have already used this coupon ${coupon.perUserLimit} time(s). Maximum usage limit reached.`);
    }

    if (coupon.applicableUsers.length > 0) {
        const isUserEligible = coupon.applicableUsers.some(id => id.toString() === userId.toString());
        if (!isUserEligible) {
            throw new Error("This coupon is not applicable for your account.");
        }
    }

    // Calculate Eligible Total
    let eligibleAmount = 0;
    let totalOrderAmount = 0;

    for (const item of orderItems) {
        const itemTotal = (item.Price || 0) * (item.Quantity || 0);
        totalOrderAmount += itemTotal;

        let isEligible = true;

        // Check Product Restriction
        if (coupon.applicableProducts.length > 0) {
            const pId = item.ProductId?._id?.toString() || item.ProductId?.toString() || item.productId?.toString();
            if (!coupon.applicableProducts.includes(pId)) {
                isEligible = false;
            }
        }

        // Check Category Restriction (if item has category)
        if (isEligible && coupon.applicableCategories && coupon.applicableCategories.length > 0) {
            // Ensure item has category info. If not, it might bypass or fail. 
            // We assume mapToOrderItemRecord populates it or caller ensures it.
            // Safe fallback: if item.category is missing, treating as not eligible if category restriction exists.
            if (!item.category || !coupon.applicableCategories.includes(item.category)) {
                isEligible = false;
            }
        }

        if (isEligible) {
            eligibleAmount += itemTotal;
        }
    }

    if (totalOrderAmount < coupon.minAmount) {
        throw new Error(`Minimum purchase amount of ₹${coupon.minAmount} is required to use this coupon.`);
    }

    // If strict category/product rules exist, ensure we have at least SOME eligible amount
    if ((coupon.applicableProducts.length > 0 || (coupon.applicableCategories && coupon.applicableCategories.length > 0)) && eligibleAmount === 0) {
        throw new Error("This coupon is not applicable for any items in your cart.");
    }

    // Calculate Discount on Eligible Amount
    let discountCalc = (eligibleAmount * coupon.discount) / 100;

    // Apply Max Cap
    if (discountCalc > coupon.maxAmount) {
        discountCalc = coupon.maxAmount;
    }

    const discountAmount = Math.round(discountCalc * 100) / 100;

    // Persist Usage
    coupon.appliedUsers.push(userId);
    coupon.usageCount += 1;
    await coupon.save({ session });

    console.log(`✅ [COUPON APPLY] Coupon "${coupon.couponCode}" applied. Eligible: ₹${eligibleAmount}, Discount: ₹${discountAmount}`);

    return { coupon, discountAmount };
};

/**
 * Restore coupon usage count and remove user from applied list
 */
const restoreCouponUsage = async (couponId, userId) => {
    if (!couponId) return;

    try {
        const coupon = await Coupon.findById(couponId);
        if (coupon) {
            // Remove one instance of userId from appliedUsers
            const index = coupon.appliedUsers.findIndex(id => id.toString() === userId.toString());
            if (index !== -1) {
                coupon.appliedUsers.splice(index, 1);
                coupon.usageCount = Math.max(0, coupon.usageCount - 1);
                await coupon.save();
                console.log(`🎟️ [COUPON RESTORE] Usage for coupon "${coupon.couponCode}" restored for user ${userId}. New Usage Count: ${coupon.usageCount}`);
            } else {
                console.log(`ℹ️ [COUPON RESTORE] User ${userId} not found in applied list for coupon ${coupon.couponCode}`);
            }
        } else {
            console.log(`⚠️ [COUPON RESTORE] Coupon with ID ${couponId} not found`);
        }
    } catch (error) {
        console.error("Error restoring coupon usage:", error.message);
    }
};

/**
 * Calculate refund amount based on proportional coupon discount
 * @param {Object} order 
 * @param {Object} item 
 */
const calculateRefundAmount = (order, item) => {
    let refundAmount = item.Price * item.Quantity;

    if (order.CouponDiscount > 0 && order.Subtotal > 0) {
        const discountPercentage = order.CouponDiscount / order.Subtotal;
        refundAmount = refundAmount * (1 - discountPercentage);
    }

    return Math.round(refundAmount * 100) / 100;
};

/**
 * Process wallet refund and create transaction
 * @param {string} userId 
 * @param {number} amount 
 * @param {string} description 
 * @param {string} orderId 
 * @param {string} method 
 */
const processWalletRefund = async (userId, amount, description, orderId, method) => {
    const userWallet = await Wallet.findOne({ userId });
    if (!userWallet) {
        throw new Error("User wallet not found");
    }

    if (userWallet.status !== "Active") {
        throw new Error("Cannot refund to inactive wallet. Please contact support.");
    }

    if (userWallet.balance + amount > 100000) {
        throw new Error("Refund would exceed wallet maximum limit of ₹100,000. Please contact support.");
    }

    userWallet.balance += amount;
    await userWallet.save();

    const transaction = await Transaction.create({
        walletId: userWallet._id,
        userId: userId,
        type: "Credit",
        amount: amount,
        description: description,
        transactionType: "Refund",
        status: "Successful",
        orderId: orderId,
        paymentMethod: ['razorpay', 'wallet', 'cod', 'card'].includes(method?.toLowerCase()) ? method.toLowerCase() : 'wallet'
    });

    return { userWallet, transaction };
};

/**
 * Check if stock is available for a product/variant
 */
const checkStockAvailability = async (productId, quantity, variantDetails = {}) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const { color, size, gender } = variantDetails;

    if (color && size) {
        let variantQuery = {
            productId: product._id,
            color: color.toLowerCase(),
            size: size.toUpperCase()
        };

        if (gender) {
            variantQuery.gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
        }

        const variant = await ProductVariant.findOne(variantQuery);
        if (!variant) return false;

        return variant.stockQuantity >= quantity;
    }

    return (product.totalStock || 0) >= quantity;
};

const Category = require("../model/Categories");

/**
 * Calculate the best available price for an item
 * Logic: MIN(Base/Variant Price, Product/Variant Offer, Category Offer)
 */
const calculateBestPrice = async (product, variant) => {
    // 1. Determine Base Price
    let basePrice = product.basePrice;
    if (variant && variant.price > 0) {
        basePrice = variant.price;
    }

    // 2. Determine Product/Variant Offer Price
    let productOfferPrice = null;
    if (variant && variant.offerPrice > 0) {
        productOfferPrice = variant.offerPrice;
    } else if (product.baseOfferPrice > 0) {
        productOfferPrice = product.baseOfferPrice;
    }

    // 3. Determine Category Offer Price
    let categoryOfferPrice = null;
    if (product.category) {
        const category = await Category.findOne({ categoryName: product.category });
        if (category && category.isOfferActive && category.categoryOffer > 0) {
            // Check for date validity if dates are present
            const now = new Date();
            const validStart = !category.startDate || new Date(category.startDate) <= now;
            const validEnd = !category.endDate || new Date(category.endDate) >= now;

            if (validStart && validEnd) {
                const discountAmount = (basePrice * category.categoryOffer) / 100;
                categoryOfferPrice = basePrice - discountAmount;
            }
        }
    }

    // 4. Find Lowest Price
    let finalPrice = basePrice;
    let appliedOffer = "None"; // For debugging/logging

    // Compare with Product Offer
    if (productOfferPrice !== null && productOfferPrice < finalPrice) {
        finalPrice = productOfferPrice;
        appliedOffer = "Product/Variant Offer";
    }

    // Compare with Category Offer
    if (categoryOfferPrice !== null && categoryOfferPrice < finalPrice) {
        finalPrice = categoryOfferPrice;
        appliedOffer = "Category Offer";
    }

    return parseFloat(finalPrice.toFixed(2));
};

/**
 * Handle Single Product Order Preparation
 */
const handleSingleProductOrder = async (productId, quantity = 1, variantDetails = {}) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found.");

    let variant = null;
    const { color, size, gender } = variantDetails;

    if (color && size) {
        let variantQuery = {
            productId: product._id,
            color: color.toLowerCase(),
            size: size.toUpperCase()
        };

        if (gender) {
            variantQuery.gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
        }

        variant = await ProductVariant.findOne(variantQuery);
        if (!variant) throw new Error(`Variant ${color}/${size} not found`);

        if (variant.stockQuantity < quantity) {
            throw new Error(`Not enough stock for ${product.productName} (${color}/${size})`);
        }
    } else {
        if ((product.totalStock || 0) < quantity) {
            throw new Error("Not enough stock available.");
        }
    }

    const price = await calculateBestPrice(product, variant);

    return {
        ProductId: productId,
        Price: price,
        Quantity: quantity,
        Status: "Pending",
        itemTotal: price * quantity,
        productName: product.productName,
        productImage: variant && variant.image ? variant.image : product.image, // Use variant image if available
        category: product.category,
        color,
        size,
        gender
    };
};

const handleCartOrder = async (userId, cartItems) => {
    let cart = await Cart.findOne({ userId });
    // Don't throw if cart doesn't exist, we might be dealing with ad-hoc items

    const items = [];
    for (let item of cartItems) {
        // Find in cart if possible
        const itemId = item.cartItemId || item.id || item._id;
        let cartItem = cart?.items?.find((ci) => ci._id.toString() === itemId);

        // Required details for product
        const pId = cartItem?.productId || item.productId || item.ProductId;
        if (!pId) throw new Error("Product ID missing for cart item");

        const product = await Product.findById(pId);
        if (!product) throw new Error("Product not found.");

        if (product.status !== 'active') {
            throw new Error(`Product ${product.productName} is currently unavailable`);
        }

        // Use details from cart if present, otherwise from request body
        const color = cartItem?.color || item.color;
        const size = cartItem?.size || item.size;
        const gender = cartItem?.gender || item.gender;
        const quantity = item.quantity || item.Quantity || 1;
        let variant = null;

        if (color && size) {
            let variantQuery = {
                productId: product._id,
                color: color.toLowerCase(),
                size: size.toUpperCase()
            };

            if (gender) {
                variantQuery.gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
            }

            variant = await ProductVariant.findOne(variantQuery);
            if (!variant) throw new Error(`Variant ${color}/${size} not found`);

            if (variant.stockQuantity < quantity) {
                throw new Error(`Not enough stock for ${product.productName} (${color}/${size})`);
            }

        } else {
            if ((product.totalStock || 0) < quantity) {
                throw new Error(`Not enough stock for ${product.productName}.`);
            }
        }

        const price = await calculateBestPrice(product, variant);

        items.push({
            ProductId: product._id,
            Price: price,
            Quantity: quantity,
            color: color,
            size: size,
            gender: gender,
            Status: "Pending",
            productName: product.productName,
            category: product.category,
            productImage: variant && variant.image ? variant.image : product.image,
            itemTotal: price * quantity
        });
    }
    return { items, cart };
};

/**
 * Remove items from cart based on product and variant matches
 */
const removeOrderedItemsFromCart = async (userId, orderItems) => {
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart || !cart.items || cart.items.length === 0) return;

        console.log(`🧹 [CART CLEANUP] Checking cart for ${orderItems.length} items to remove`);
        let removedCount = 0;

        for (const orderItem of orderItems) {
            const pId = (orderItem.ProductId || orderItem.productId)?.toString();
            const color = orderItem.color;
            const size = orderItem.size;

            const initialLength = cart.items.length;
            cart.items = cart.items.filter(cartItem => {
                const sameProduct = cartItem.productId.toString() === pId;
                const sameColor = !color || cartItem.color === color;
                const sameSize = !size || cartItem.size === size;

                // If it matches everything, filter it OUT
                return !(sameProduct && sameColor && sameSize);
            });

            if (cart.items.length < initialLength) {
                removedCount++;
            }
        }

        if (removedCount > 0) {
            await cart.save();
            console.log(`✅ [CART CLEANUP] Removed ${removedCount} items from cart`);
        }
    } catch (error) {
        console.error("❌ [CART CLEANUP] Error removing items:", error.message);
    }
};

/**
 * Handle Referral Reward on first delivered order
 */
const handleReferralReward = async (userId) => {
    const user = await User.findById(userId);
    if (!user || !user.referredBy || user.isReferrerRewardClaimed) return;

    // Check if this is indeed the first delivered order
    const Order = require("../model/Orders");
    const deliveredOrders = await Order.countDocuments({
        UserId: userId,
        orderStatus: "Delivered"
    });

    if (deliveredOrders === 1) {
        const referrer = await User.findOne({ referralCode: user.referredBy });
        if (referrer) {
            const referrerWallet = await Wallet.findOne({ userId: referrer._id });
            if (referrerWallet && referrerWallet.status === "Active") {
                const bonusAmount = 100;
                if (referrerWallet.balance + bonusAmount <= 100000) {
                    referrerWallet.balance += bonusAmount;
                    await referrerWallet.save();

                    await Transaction.create({
                        walletId: referrerWallet._id,
                        userId: referrer._id,
                        type: "Credit",
                        amount: bonusAmount,
                        description: `Referral Bonus: ${user.username || 'Friend'} completed first order`,
                        transactionType: "Referral",
                        status: "Successful"
                    });

                    user.isReferrerRewardClaimed = true;
                    await user.save();
                    return true;
                }
            }
        }
    }
    return false;
};

/**
 * Restore stock if any items are in Pending status (used during payment cancellation/failure)
 */
const restoreStockIfPending = async (order) => {
    const needsStockRestore = order.items.some(item =>
        item.Status === 'Pending' || item.Status === 'Payment Failed'
    );

    if (needsStockRestore) {
        await increaseStockForOrder(order.items);

        // Restore coupon if applicable
        if (order.CouponId) {
            await restoreCouponUsage(order.CouponId, order.UserId);
        }

        return true;
    }
    return false;
};

/**
 * Verify Razorpay Signature
 */
const verifyRazorpaySignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(String(razorpayOrderId) + '|' + String(razorpayPaymentId))
        .digest('hex');

    return expectedSignature === razorpaySignature;
};

/**
 * Create a snapshot of the shipping address for an order
 */
const createShippingSnapshot = (address, user) => {
    return {
        name: address.fullName || (user ? user.username : "N/A"),
        phone: address.phone || (user ? user.phone : "N/A"),
        addressLine1: address.street,
        addressLine2: address.house,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        country: address.country,
        pincode: address.zipCode.toString()
    };
};

/**
 * Map a single order item record to its display format
 */
const formatOrderItem = (item) => {
    return {
        itemId: item._id,
        productId: item.ProductId?._id || item.ProductId,
        productName: item.ProductId?.productName || item.productName || "Unknown Product",
        productImage: item.ProductId?.image || item.productImage,
        price: item.Price,
        quantity: item.Quantity,
        itemTotal: item.itemTotal,
        status: item.Status,
        color: item.color,
        size: item.size,
        gender: item.gender,
        trackingNumber: item.trackingNumber,
        confirmedAt: item.confirmedAt,
        shippedAt: item.shippedAt,
        deliveredAt: item.deliveredAt,
        cancelledAt: item.cancelledAt,
        returnedAt: item.returnedAt,
        cancellationReason: item.cancellationReason,
        returnReason: item.returnReason,
        refundStatus: item.RefundStatus,
        refundAmount: item.refundAmount,
        refundedAt: item.refundedAt,
        canCancel: !["Delivered", "Cancelled", "Returned", "Shipped", "Out for Delivery"].includes(item.Status),
        canReturn: item.Status === "Delivered"
    };
};

/**
 * Format an order summary for list views
 */
const formatOrderSummary = (order) => {
    const itemCount = order.items.reduce((sum, item) => sum + (item.Quantity || 0), 0);
    const productImages = order.items
        .slice(0, 3)
        .map(item => item.ProductId?.image || item.productImage)
        .filter(Boolean);

    const summary = {
        _id: order._id,
        orderId: `ORD-${order._id.toString().slice(0, 8).toUpperCase()}`,
        orderDate: order.createdAt,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        totalAmount: order.TotalAmount,
        itemCount,
        productImages,
        expectedDeliveryDate: order.expectedDeliveryDate,
        canCancel: order.items.some(item =>
            !["Delivered", "Cancelled", "Returned", "Shipped", "Out for Delivery"].includes(item.Status)
        ),
        canReturn: order.items.some(item => item.Status === "Delivered")
    };

    // Include user info if populated (Admin view)
    if (order.UserId && typeof order.UserId === 'object') {
        summary.userName = order.UserId.username || "Unknown";
        summary.userEmail = order.UserId.email || "Unknown";
        summary.userPhone = order.UserId.phone || "Unknown";
        summary.userId = order.UserId._id;
    }

    return summary;
};

/**
 * Map an input item to a standardized OrderItem record
 */
const mapToOrderItemRecord = (product, quantity, price, variantDetails = {}) => {
    const { color, size, gender } = variantDetails;
    return {
        ProductId: product._id,
        productName: product.productName,
        productImage: product.image,
        category: product.category, // Added category for coupon validation
        Price: price,
        Quantity: quantity,
        itemTotal: price * quantity,
        color,
        size,
        gender,
        Status: "Pending"
    };
};

module.exports = {
    decreaseStockForOrder,
    increaseStockForOrder,
    validateAndApplyCoupon,
    calculateRefundAmount,
    processWalletRefund,
    checkStockAvailability,
    handleSingleProductOrder,
    handleCartOrder,
    removeOrderedItemsFromCart,
    ensureStockAndDeductForOrder,
    verifyRazorpaySignature,
    handleReferralReward,
    restoreStockIfPending,
    createShippingSnapshot,
    formatOrderItem,
    formatOrderSummary,
    mapToOrderItemRecord,
    restoreCouponUsage
};
