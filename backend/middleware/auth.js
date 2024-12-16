const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

// exports.isAuthenticated = catchAsyncError( async (req, res, next) => {
//     const { token } = req.cookies;

//     if (!token) {
//         return next(new ErrorHandler("Please login to continue", 401));
//     };

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = await User.findById(decoded.id);

//     next();
// })
exports.isAuthenticated = (req, res, next) => {
    console.log("Reached isAuthenticated middleware");

    const accessToken = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.cookies['refreshToken'];
  
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    if (!accessToken && !refreshToken) {
        return res.status(401).send('Access Denied. No token provided.');
    }

    try {
        // Verify accessToken first
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        req.user = decoded.id || decoded.user; // Flexible user ID extraction
        return next();
    } catch (error) {
        console.log("Access token verification error:", error.message);

        // If access token is invalid, check for refreshToken
        if (!refreshToken) {
            return res.status(401).send('Access Denied. No refresh token provided.');
        }

        try {
            const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
            
            // Generate new access token
            const newAccessToken = jwt.sign(
                { id: decodedRefresh.id || decodedRefresh.user }, 
                process.env.JWT_SECRET_KEY, 
                { expiresIn: '1h' }
            );

            // Set new access token in response headers
            res.set('Authorization', `Bearer ${newAccessToken}`);
            
            // Set user in request
            req.user = decodedRefresh.id || decodedRefresh.user;
            
            return next();
        } catch (error) {
            console.log("Refresh token verification error:", error.message);
            return res.status(401).send('Invalid Token.');
        }
    }
};

exports.verifyRefreshToken = (req, res, next) => {
    console.log("Verifying Refresh Token");
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken, "hahaha")

    if (!refreshToken) {
        return res.status(403).json({ 
            message: 'No refresh token found',
            // requireLogin: true 
        }); 
    } 
  
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
        req.user = decoded.id || decoded.user;
        next();

    } catch (error) {
        console.log("errror")
        return res.status(403).json({ 
            message: 'Invalid refresh token', 
            // requireLogin: true 
        });
    }
};