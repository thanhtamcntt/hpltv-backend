const User = require('../../../../models/user');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.getAllUser = AsyncHandler(async (req, res, next) => {
  const user = await User.find({ role: 'admin' }).sort({ createAt: -1 });

  res.status(200).json({
    success: true,
    data: user,
    message: 'get all user successfully',
  });
});
