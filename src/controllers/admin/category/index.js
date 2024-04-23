const Category = require('../../../models/category');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');


exports.postCreateCategory = AsyncHandler(async (req, res, next) => {
  console.log('body created', req.body);
  const category = await Category.create({
    name: req.body.name,
    createAt: Date.now(),
    createBy: '6543c28ae4b2dbdf546106c3',
  });
  if (!category) {
    return next(
      new ErrorResponse(
        `The system is experiencing problems, please try again later!!`,
        401,
      ),
    );
  }
  res.status(201).json({
    success: true,
    data: category,
    message: 'Create category successfully',
  });
});
exports.postDeleteCategory = AsyncHandler(async (req, res, next) => {
  console.log(req.params);
  if (!req.params.categoryId) {
    return next(
      new ErrorResponse(`Please enter a valid id category delete`, 404),
    );
  }
  const category = await Category.deleteOne({ _id: req.params.categoryId });
  if (!category) {
    return next(
      new ErrorResponse(
        `The system is experiencing problems, please try again later!!`,
        401,
      ),
    );
  }
  res.status(201).json({
    success: true,
    message: `delete category ${req.params.categoryId} successfully`,
  });
});
exports.postUpdateCategory = AsyncHandler(async (req, res, next) => {
  console.log(req.params);
  const category = await Category.findById(req.params.categoryId);
  console.log(req.body);
  if (!category) {
    return next(
      new ErrorResponse(
        `Cannot find category id ${req.params.categoryId}!!`,
        401,
      ),
    );
  }
  category.name = req.body.name;
  category.updateAt = Date.now();
  await category.save();
  res.status(201).json({
    success: true,
    data: category,
    message: `update category ${req.params.categoryId} successfully`,
  });
});