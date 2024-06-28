const Message = require('../../../models/message');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.getOnMessage = AsyncHandler(async (req, res, next) => {
  const message = await Message.find({ isChatStatus: true }).populate({
    path: 'participants.userId',
  });
  res.status(200).json({
    data: message,
    success: true,
    message: `Get all message on chat successfully.`,
  });
});

exports.getMessageUser = AsyncHandler(async (req, res, next) => {
  const message = await Message.findOne({
    'participants.userId': req.params.userId,
    isChatStatus: true,
  });

  res.status(200).json({
    data: message,
    success: true,
    message: `Get message user ${req.params.userId} successfully.`,
  });
});
