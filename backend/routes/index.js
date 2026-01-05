const express = require('express');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const variantRoutes = require('./variantRoutes');
const couponRoutes = require('./couponRoutes')
const orderRoutes = require('./orderRoutes');
const categoryRoutes = require('./categoryRuotes');
const adminRoutes = require('./adminRoutes')
const userProfile = require('./userProfileRoutes');
const userCartRoutes = require('./userCartRoutes');
const userWishlistRoutes = require('./userWishlistRoutes');
const userComparisonRoutes = require('./userComparisonRoutes');
const salesRoutes = require('./salesRoutes');
const walletRoutes = require('./walletRoutes');
const reviewRoutes = require('./reviewRoutes')

const router = express.Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/variants', variantRoutes);
router.use('/coupons', couponRoutes)
router.use('/category', categoryRoutes)
router.use('/orders', orderRoutes)
router.use('/sales', salesRoutes)
router.use('/admin', adminRoutes)
router.use('/wallet', walletRoutes)
router.use('/userProfile', userProfile)
router.use('/user-cart', userCartRoutes);
router.use('/user-wishlist', userWishlistRoutes);
router.use('/user-comparison', userComparisonRoutes);
router.use('/reviews', reviewRoutes)



module.exports = router; 