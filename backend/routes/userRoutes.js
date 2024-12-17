const express = require('express');
const router = express.Router();
const { isAuthenticated, verifyRefreshToken } = require('../middleware/auth');
const catchAsyncErrors = require('../middleware/catchAsyncError');
const { 
  signupUser, loginUser, logoutUser,
  activateAccount, getUser,
  updateUserInfo, updateAvatar,
  addAddress, editAddress, removeAddress,
  forgotPassword, updatePassword, resetPassword,
  getAllUsers,
  googleLogin,
  otpLogin, verifyEmailOtp,
  refreshToken
} = require('../controller/userController');

// User Routes
router.post('/signup-user', catchAsyncErrors(signupUser));
router.post('/activation/:activation_token', catchAsyncErrors(activateAccount));
router.post('/login-user', catchAsyncErrors(loginUser));
router.get('/getUser', isAuthenticated, catchAsyncErrors(getUser));
router.post('/logout', catchAsyncErrors(logoutUser));
router.put('/update-user-info', isAuthenticated, catchAsyncErrors(updateUserInfo));
router.put('/update-avatar', isAuthenticated, catchAsyncErrors(updateAvatar));


// Address Routes
router.post('/address', isAuthenticated, catchAsyncErrors(addAddress));
router.put('/address', isAuthenticated, catchAsyncErrors(editAddress));
router.delete('/address', isAuthenticated, catchAsyncErrors(removeAddress)); 


// Password Routes
router.post('/forgot-password', catchAsyncErrors(forgotPassword));
router.put('/reset-password/:token', catchAsyncErrors(resetPassword));
router.put('/update-password', isAuthenticated, catchAsyncErrors(updatePassword));

router.get('/getUsers', catchAsyncErrors(getAllUsers));
router.post('/google-login', catchAsyncErrors(googleLogin));

router.post('/otp-login', catchAsyncErrors(otpLogin));
router.post('/verify-otp', catchAsyncErrors(verifyEmailOtp));

router.get('/refresh-token', verifyRefreshToken, catchAsyncErrors(refreshToken))

module.exports = router;
