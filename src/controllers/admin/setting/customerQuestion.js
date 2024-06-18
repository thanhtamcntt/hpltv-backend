const CustomerQuestions = require('../../../models/customerQuestions');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.postCreateCustomerQuestions = AsyncHandler(async (req, res, next) => {
  const question = await CustomerQuestions.create({
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId,
    createAt: Date.now(),
  });
  if (!question) {
    return next(
      new ErrorResponse(
        `The system is experiencing problems, please try again later!!`,
        401,
      ),
    );
  }
  res.status(201).json({
    success: true,
    message: 'Create question successfully',
  });
});
