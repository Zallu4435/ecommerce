const express = require('express');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const couponRoutes = require('./couponRoutes')
const orderRoutes = require('./orderRoutes');
const categoryRoutes = require('./categoryRuotes');
const adminRoutes = require('./adminRoutes')
const userProfile = require('./userProfileRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/coupons', couponRoutes)
router.use('/category', categoryRoutes)
router.use('/orders', orderRoutes)
router.use('/admin', adminRoutes)
router.use('/userProfile', userProfile)



module.exports = router; 