const AsyncHandler = require('express-async-handler');
const Order = require('../../../models/order');
const Subscriber = require('../../../models/subscriber');
const ErrorResponse = require('../../../utils/errorResponse');

exports.getAllOrder = AsyncHandler(async (req, res, next) => {
  const order = await Order.find().populate('packageId');

  return res.status(200).json({
    data: order,
    success: true,
    message: `Get all order successfully.`,
    version: 1.0,
  });
});

exports.postPackageOrder = AsyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ userId: req.body.userId });

  if (!order) {
    return res.status(200).json({
      success: false,
      version: 1.0,
    });
  }

  return res.status(200).json({
    success: true,
    message: `Find order payment id ${req.body.userId} successfully.`,
    version: 1.0,
  });
});

exports.postAddPaymentUser = AsyncHandler(async (req, res, next) => {
  const user = await Subscriber.findById(req.user.userId);
  if (!user) {
    return next(new ErrorResponse('User not found!!', 401));
  }

  let order;
  if (req.query.login) {
    await Order.deleteOne({ userId: req.body.userId });
    order = await Order.create({
      userId: req.body.userId,
      packageId: req.body.packageId,
      createAt: Date.now(),
      expirationDate: Date.now() + 60 * 60 * 24 * 30 * 1000,
    });
  } else {
    order = await Order.create({
      userId: req.body.userId,
      packageId: req.body.packageId,
      createAt: Date.now(),
      expirationDate: Date.now() + 60 * 60 * 24 * 30 * 1000,
    });
  }
  console.log('data đâu', order);
  let dataOrder = await Order.findById(order._id).populate('packageId');
  return res.status(201).json({
    order: dataOrder,
    success: true,
    message: `Create order payment id ${req.user._id} successfully.`,
    version: 1.0,
  });
});
