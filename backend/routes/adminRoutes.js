const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncError');
const { banUser, loginAdmin, adminRefreshToken, getUserDetails } = require('../controller/adminController');
const { verifyAdminRefreshToken } = require('../middleware/auth');

router.post('/ban/:id', banUser);
router.post('/login-admin', catchAsyncErrors(loginAdmin));
router.get('/admin-refresh-token', verifyAdminRefreshToken, catchAsyncErrors(adminRefreshToken))
router.get('/get-user-details/:id', catchAsyncErrors(getUserDetails));



module.exports = router; 