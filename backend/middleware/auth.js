const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken && !refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.user = decoded.id || decoded.user;
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

      const newAccessToken = jwt.sign(
        { id: decodedRefresh.id || decodedRefresh.user },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.set("Authorization", `Bearer ${newAccessToken}`);

      req.user = decodedRefresh.id || decodedRefresh.user;

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
