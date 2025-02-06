const express = require('express');
const router = express.Router();
const { isAuthenticated, verifyRefreshToken } = require('../middleware/auth');
const catchAsyncErrors = require('../middleware/catchAsyncError');
const { 
  signupUser, loginUser, logoutUser,
  activateAccount, getUser,
  updateUserInfo, updateAvatar,
  updatePassword, 
  resetPassword, verifyResetPassword,
  getAllUsers,
  googleLogin,
  otpLogin, verifyEmailOtp,
  refreshToken,
} = require('../controller/userController');

router.get('/getUser', isAuthenticated, catchAsyncErrors(getUser));

router.post('/signup-user', catchAsyncErrors(signupUser));
router.post('/activation/:activation_token', catchAsyncErrors(activateAccount));
router.post('/login-user', catchAsyncErrors(loginUser));
router.post('/logout', catchAsyncErrors(logoutUser));

router.put('/update-user-info', isAuthenticated, catchAsyncErrors(updateUserInfo));
router.put('/update-avatar', isAuthenticated, catchAsyncErrors(updateAvatar));


router.post('/reset-password', catchAsyncErrors(resetPassword));
router.post('/verify-reset-password', catchAsyncErrors(verifyResetPassword))
router.put('/update-password', isAuthenticated, catchAsyncErrors(updatePassword));


router.get('/getUsers', catchAsyncErrors(getAllUsers));
router.post('/google-login', catchAsyncErrors(googleLogin));


router.post('/otp-login', catchAsyncErrors(otpLogin));
router.post('/verify-otp', catchAsyncErrors(verifyEmailOtp));


router.get('/refresh-token', verifyRefreshToken, catchAsyncErrors(refreshToken))



module.exports = router;
