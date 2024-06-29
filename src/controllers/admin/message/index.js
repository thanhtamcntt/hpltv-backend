const Message = require('../../../models/message');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.postCreateMessage = AsyncHandler(async (req, res, next) => {
  const message = await Message.create({
    roomId: req.body.roomId,
    participants: req.body.participants,
  });
  if (!message) {
    return next(
      new ErrorResponse(
        `The system is experiencing problems, please try again later!!`,
        401,
      ),
    );
  }
  res.status(201).json({
    success: true,
    data: message,
    message: 'Create message successfully',
  });
});

exports.postUpdateMessage = AsyncHandler(async (req, res, next) => {
  const message = await Message.findOne({ roomId: req.params.roomId });
  console.log(req.body);
  if (!message) {
    return next(
      new ErrorResponse(
        `Cannot find message with room Id ${req.params.roomId}!!`,
        401,
      ),
    );
  }
  const filter = { roomId: req.params.roomId };
  const update = {
    $push: {
      messages: req.body,
    },
  };
  await Message.updateOne(filter, update);

  res.status(201).json({
    success: true,
    message: `update message with room Id ${req.params.roomId} successfully`,
  });
});

exports.postUpdateOff = AsyncHandler(async (req, res, next) => {
  if (!req.params.roomId) {
    return next(new ErrorResponse(`Please enter a valid roomId!!`, 401));
  }

  await Message.updateOne(
    { roomId: req.params.roomId },
    { isChatStatus: false },
  );

  res.status(201).json({
    success: true,
    message: `Update status live chat roomId ${req.body.roomId} successfully`,
  });
});

// exports.postChangeStatus = AsyncHandler(async (req, res, next) => {
//   if (!req.body.roomId) {
//     return next(new ErrorResponse(`Please enter a valid roomId!!`, 401));
//   }

//   await Message.updateOne({ roomId: req.body.roomId }, { isChatStatus: true });

//   res.status(201).json({
//     success: true,
//     message: `Update status live chat roomId ${req.body.roomId} successfully`,
//   });
// });

// exports.postDeleteCategory = AsyncHandler(async (req, res, next) => {
//   console.log(req.params);
//   if (!req.params.categoryId) {
//     return next(
//       new ErrorResponse(`Please enter a valid id category delete`, 404),
//     );
//   }
//   const category = await Category.findOne({ _id: req.params.categoryId });
//   if (!category) {
//     return next(
//       new ErrorResponse(
//         `Cannot find category id ${req.params.categoryId}!!`,
//         401,
//       ),
//     );
//   }

//   await Movies.updateMany(
//     { listCategoryId: req.params.categoryId },
//     { $pull: { listCategoryId: req.params.categoryId } },
//   );
//   await Series.updateMany(
//     { listCategoryId: req.params.categoryId },
//     { $pull: { listCategoryId: req.params.categoryId } },
//   );

//   await Category.deleteOne({ _id: req.params.categoryId });
//   res.status(201).json({
//     success: true,
//     message: `delete category ${req.params.categoryId} successfully`,
//   });
// });
