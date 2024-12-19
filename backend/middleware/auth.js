const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const User = require('../model/User');


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
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        req.user = decoded.id || decoded.user;
        return next();
    } catch (error) {
        console.log("Access token verification error:", error.message);

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

            res.set('Authorization', `Bearer ${newAccessToken}`);
            
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
            requireLogin: true 
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
            requireLogin: true 
        });
    }
};  




exports.verifyAdminRefreshToken = (req, res, next) => {
    // console.log("Verifying Admin Refresh Token");
    const adminRefreshToken = req.cookies.adminRefreshToken; // Assume adminRefreshToken is stored in cookies
    // console.log(adminRefreshToken, "Admin Refresh Token");

    if (!adminRefreshToken) {
        return res.status(403).json({ 
            message: 'No admin refresh token found', 
            requireLogin: true 
        });
    }

    try {
        // Verify the adminRefreshToken with a separate secret key
        const decoded = jwt.verify(adminRefreshToken, process.env.JWT_REFRESH_SECRET_KEY);

        // Attach the admin's data (e.g., admin ID or other payload) to the request object
        req.admin = decoded.id || decoded.admin;
        next();
    } catch (error) {
        // console.log("Error verifying admin refresh token");
        return res.status(403).json({ 
            message: 'Invalid admin refresh token', 
            requireLogin: true 
        });
    }
};
