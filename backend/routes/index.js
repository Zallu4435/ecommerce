const express = require('express');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const couponRoutes = require('./couponRoutes')
const orderRoutes = require('./orderRoutes');
const categoryRoutes = require('./categoryRuotes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/coupons', couponRoutes)
router.use('/categories', categoryRoutes)
router.use('/orders', orderRoutes)


module.exports = router; 