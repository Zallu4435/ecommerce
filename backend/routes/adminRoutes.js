const express = require('express');
const router = express.Router();
const catchAsyncErrors = require('../middleware/catchAsyncError');
const { banUser, loginAdmin, adminRefreshToken, getUserDetails, logoutAdmin, adminDashboard } = require('../controller/adminController');
const { verifyAdminRefreshToken } = require('../middleware/auth');

router.post('/ban/:id', banUser);
router.post('/login-admin', catchAsyncErrors(loginAdmin));
router.post('/logout', catchAsyncErrors(logoutAdmin));
router.get('/admin-refresh-token', verifyAdminRefreshToken, catchAsyncErrors(adminRefreshToken))
router.get('/get-user-details/:id', catchAsyncErrors(getUserDetails));
router.get('/metrics', catchAsyncErrors(adminDashboard));


module.exports = router; 