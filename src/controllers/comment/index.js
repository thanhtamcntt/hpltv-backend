const Comment = require('../../models/comment');
const Subscriber = require('../../models/subscriber');
const AsyncHandler = require('express-async-handler');
const ErrorResponse = require('../../utils/errorResponse');
const hashToken = require('../../helpers/signJwtToken.js');

exports.getAllComment = async (req, res, next) => {
  const comment = await Comment.find()
    .populate('userId')
    .sort({ createAt: -1 });
  res.status(200).json({
    data: comment,
    success: true,
    count: comment.length,
    message: `Get all comment successfully.`,
  });
};

exports.postAddComment = AsyncHandler(async (req, res, next) => {
  console.log('req.body', req.body);
  let newComment;
  if (req.body.parentCommentId && req.body.parentUserId) {
    newComment = await Comment.create({
      content: req.body.content,
      userId: req.body.userId,
      moviesId: req.body.moviesId,
      parentCommentId: req.body.parentCommentId,
      parentUserId: req.body.parentUserId,
      createAt: Date.now(),
    });
  } else {
    newComment = await Comment.create({
      content: req.body.content,
      userId: req.body.userId,
      moviesId: req.body.moviesId,
      createAt: Date.now(),
    });
  }

  if (newComment) {
    return res.status(200).json({
      data: newComment,
      success: true,
      message: 'Create comment successfully.',
      version: 1.0,
    });
  } else {
    return next(
      new ErrorResponse(
        'The server is having problems, please try again later!!',
        401,
      ),
    );
  }
});
