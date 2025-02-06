const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const { addToComparison, getComparisonList, removeFromComparison } = require('../controller/userComparisonController')

router.get("/comparison", isAuthenticated, catchAsyncErrors(getComparisonList));
router.post('/comparison', isAuthenticated, catchAsyncErrors(addToComparison));
router.delete('/comparison/:id', isAuthenticated, catchAsyncErrors(removeFromComparison));

module.exports = router;
