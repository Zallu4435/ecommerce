// create token and saving that in cookies
const jwt = require('jsonwebtoken');

exports.sendToken = (user, statusCode, res) => {
  console.log("closure from")
    const accessToken = user.getJwtToken();
  
    // Generate refresh token
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE, // e.g., '90d'
    });

    console.log("i'm from the send token ")
    // Options for cookies
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      httpOnly: true, // Prevent access via JavaScript
      sameSite: "none", // Cross-site cookies
      secure: true, // Send only over HTTPS
    };
  
    res.status(statusCode).cookie("refreshToken", refreshToken, options)
    .header("Authorization", `Barearer ${accessToken}`)
    .json({
      success: true,
      user,
      accessToken:accessToken
    });
  };
  




  exports.sendAdminToken = (admin, statusCode, res) => {
    // Ensure that the provided admin is an actual admin (based on role)
    if (admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized as an admin.' });
    }
  
    // Generate access token for the admin
    const adminAccessToken = admin.generateAdminToken();
    // console.log(adminAccessToken, "reached here from hre ")

    // Generate refresh token for the admin
    const adminRefreshToken = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE, // e.g., '90d'
    });
  
    // Options for cookies
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      httpOnly: true, // Prevent access via JavaScript
      sameSite: "none", // Cross-site cookies
      secure: true, // Send only over HTTPS
    };
  
    res.status(statusCode)
      .cookie("adminRefreshToken", adminRefreshToken, options) 
      .header("Authorization", `Bearer ${adminAccessToken}`) 
      .json({
        success: true,
        admin,
        adminAccessToken,  // Send the access token
      });
  };
  
