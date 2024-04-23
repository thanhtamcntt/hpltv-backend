const AsyncHandler = require('express-async-handler');
const Order = require('../../../models/order');
const Subscriber = require('../../../models/subscriber');
const ErrorResponse = require('../../../utils/errorResponse');

exports.getAllOrder = AsyncHandler(async (req, res, next) => {
  const order = await Order.find();

  return res.status(200).json({
    data: order,
    success: true,
    message: `Get all order successfully.`,
    version: 1.0,
  });
});

exports.postPackageOrder = AsyncHandler(async (req, res, next) => {
  // console.log('req body', req.body);
  const order = await Order.find({ userId: req.body.userId });
  // console.log('order', order);
  if (order.length < 1) {
    console.log(order.length);
    return res.status(200).json({
      success: false,
      version: 1.0,
    });
  }

  return res.status(200).json({
    success: true,
    message: `Find order payment id ${req.user._id} successfully.`,
    version: 1.0,
  });
});

exports.postAddPaymentUser = AsyncHandler(async (req, res, next) => {
  console.log('req body', req.body.userId);
  console.log('req body', req.query);
  console.log('req body', req.user._id);
  const user = await Subscriber.findById(req.user._id);
  console.log('k vô đây');
  if (!user) {
    console.log('k vô đây');
    return next(new ErrorResponse('User not found!!', 401));
  }
  console.log('user', user);

  let order;
  if (req.query.login) {
    await Order.deleteOne({ userId: req.body.userId });
    order = await Order.create({
      userId: req.body.userId,
      information: req.body.dataPayment,
      createAt: Date.now(),
      expirationDate: Date.now() + 60 * 60 * 24 * 30 * 1000,
    });
  } else {
    order = await Order.create({
      userId: req.body.userId,
      information: req.body.dataPayment,
      createAt: Date.now(),
      expirationDate: Date.now() + 60 * 60 * 24 * 30 * 1000,
    });
  }
  console.log('vô đây không ??', order);

  return res.status(201).json({
    order: order,
    success: true,
    message: `Create order payment id ${req.user._id} successfully.`,
    version: 1.0,
  });
});
