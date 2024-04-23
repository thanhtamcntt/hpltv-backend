const Comment = require('../../../models/comment');
const AsyncHandler = require('express-async-handler');
const ErrorResponse = require('../../../utils/errorResponse');

exports.getAllComment = async (req, res, next) => {
  const comment = await Comment.find()
    .populate('userId')
    .populate('parentUserId')
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
  console.log('req.query', req.query);
  let newComment;
  if (req.query.reply) {
    newComment = await Comment.create({
      content: req.body.content,
      userId: req.body.userId,
      moviesId: req.body.moviesId,
      parentCommentId: req.body.parentCommentId,
      parentUserId: req.body.parentUserId,
      rootCommentId: req.body.rootCommentId,
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
console.log('newComment', newComment);
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

exports.postDeleteComment = async (req, res, next) => {
  if (!req.params.commentId) {
    return next(
      new ErrorResponse(`Please enter a valid id comment delete`, 404),
    );
  }

  const comment = await Comment.deleteOne({ _id: req.params.commentId });

  if (!comment) {
    return next(
      new ErrorResponse(
        `The system is experiencing problems, please try again later!!`,
        401,
      ),
    );
  }

  res.status(201).json({
    success: true,
    message: `delete comment ${req.params.commentId} successfully`,
  });
};

exports.postUpdateComment = AsyncHandler(async (req, res, next) => {
  console.log(req.body);
  const comment = await Comment.findById(req.body.commentId);
  if (!comment) {
    return next(
      new ErrorResponse(`Cannot find comment id ${req.body.commentId}!!`, 401),
    );
  }
  comment.content = req.body.content;

  await comment.save();
  res.status(201).json({
    success: true,
    data: comment,
    message: `update comment ${req.body.commentId} successfully`,
  });
});
