const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const catchAsyncErrors = require('../middleware/catchAsyncError');
const { 
  signupUser, loginUser, logoutUser,
  activateUser, getUser,
  updateUserInfo, updateAvatar,
  addAddress, editAddress, removeAddress,
  forgotPassword, updatePassword, resetPassword,
  getAllUsers
} = require('../controller/userController');

// User Routes
router.post('/signup-user', catchAsyncErrors(signupUser));
router.post('/activation', catchAsyncErrors(activateUser));
router.post('/login-user', catchAsyncErrors(loginUser));
router.get('/getUser', isAuthenticated, catchAsyncErrors(getUser));
router.get('/logout', catchAsyncErrors(logoutUser));
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


module.exports = router;
