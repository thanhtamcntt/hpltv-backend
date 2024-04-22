const Subscriber = require('../../../../models/subscriber');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');


exports.getAllSubscriber = AsyncHandler(async (req, res, next) => {
  const subscriber = await Subscriber.find().sort({ createAt: -1 });

  res.status(200).json({
    success: true,
    data: subscriber,
    message: 'get all subscriber successfully',
  });
});
