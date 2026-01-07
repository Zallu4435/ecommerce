const jwt = require("jsonwebtoken");

exports.sendToken = (user, statusCode, res) => {
  const accessToken = user.getJwtToken();

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    }
  );

  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  res
    .status(statusCode)
    .cookie("refreshToken", refreshToken, options)
    .header("Authorization", `Bearer ${accessToken}`)
    .json({
      success: true,
      user,
      accessToken: accessToken,
    });
};

exports.sendAdminToken = (admin, statusCode, res) => {
  if (admin.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "You are not authorized as an admin." });
  }

  const adminAccessToken = admin.generateAdminToken();

  const adminRefreshToken = jwt.sign(
    { id: admin._id, isAdmin: true },
    process.env.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE,
    }
  );

  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  res
    .status(statusCode)
    .cookie("adminRefreshToken", adminRefreshToken, options)
    .header("Authorization", `Bearer ${adminAccessToken}`)
    .json({
      success: true,
      admin,
      adminAccessToken,
    });
};
