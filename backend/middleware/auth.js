const jwt = require("jsonwebtoken");
const User = require("../model/User");

exports.isAuthenticated = async (req, res, next) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.id || decoded.user;

    // Check if user is blocked or inactive
    const user = await User.findById(userId).select('isBlocked status');
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        requireLogin: true
      });
    }

    if (user.isBlocked) {
      // Clear refresh token cookie to force logout
      res.cookie("refreshToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.status(403).json({
        message: "Your account has been blocked. Please contact support.",
        isBlocked: true,
        requireLogin: true
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        message: "Your account is not active. Please activate your account.",
        requireLogin: true
      });
    }

    req.user = userId;
    return next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY
      );

      const userId = decodedRefresh.id || decodedRefresh.user;

      // Check if user is blocked or inactive
      const user = await User.findById(userId).select('isBlocked status');
      if (!user) {
        return res.status(401).json({
          message: "User not found",
          requireLogin: true
        });
      }

      if (user.isBlocked) {
        // Clear refresh token cookie to force logout
        res.cookie("refreshToken", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });

        return res.status(403).json({
          message: "Your account has been blocked. Please contact support.",
          isBlocked: true,
          requireLogin: true
        });
      }

      if (user.status !== 'active') {
        return res.status(403).json({
          message: "Your account is not active. Please activate your account.",
          requireLogin: true
        });
      }

      const newAccessToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.set("Authorization", `Bearer ${newAccessToken}`);
      req.user = userId;

      return next();
    } catch (error) {
      return res.status(401).send("Invalid Token.");
    }
  }
};

exports.verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({
      message: "No refresh token found",
      requireLogin: true,
    });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );
    req.user = decoded.id || decoded.user;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid refresh token",
      requireLogin: true,
    });
  }
};

exports.verifyAdminRefreshToken = (req, res, next) => {
  const adminRefreshToken = req.cookies.adminRefreshToken;

  if (!adminRefreshToken) {
    return res.status(403).json({
      message: "No admin refresh token found",
      requireLogin: true,
    });
  }

  try {
    const decoded = jwt.verify(
      adminRefreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );
    req.admin = decoded.id || decoded.admin;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid admin refresh token",
      requireLogin: true,
    });
  }
};
