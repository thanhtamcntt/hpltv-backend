const AsyncHandler = require('express-async-handler');

exports.getVerifyUserToken = AsyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    userInfo: req.user,
    version: 1.0,
  });
});