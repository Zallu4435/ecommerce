// create token and saving that in cookies
const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
    const accessToken = user.getJwtToken();
  
    // Generate refresh token
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE, // e.g., '90d'
    });

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
  
  module.exports = sendToken;



