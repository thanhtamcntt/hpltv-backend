const Subscriber = require('../../../../models/subscriber');
const Order = require('../../../../models/order');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.getAllSubscriber = AsyncHandler(async (req, res, next) => {
  let subscriber;
  if (req.query.banned === 'false') {
    subscriber = await Subscriber.find({ isBanned: false }).sort({
      createAt: -1,
    });
  } else {
    subscriber = await Subscriber.find({ isBanned: true }).sort({
      createAt: -1,
    });
  }

  res.status(200).json({
    success: true,
    data: subscriber,
    message: 'get all subscriber successfully',
  });
});

exports.getSubscriberTop5 = AsyncHandler(async (req, res, next) => {
  const subscriber = await Subscriber.find({}).sort({ createAt: -1 }).limit(5);

  res.status(200).json({
    success: true,
    data: subscriber,
    message: 'get all subscriber to day successfully',
  });
});

exports.getSubscriberOrderTop5 = AsyncHandler(async (req, res, next) => {
  const order = await Order.find({})
    .populate('userId')
    .populate('packageId')
    .sort({ createAt: -1 })
    .limit(5);
  let data = [];
  for (let i = 0; i < order.length; i++) {
    const obj = {
      firstName: order[i].userId.firstName,
      lastName: order[i].userId.lastName,
      typePack: order[i].packageId.typePack,
      monthlyPrice: order[i].packageId.monthlyPrice,
    };
    data.push(obj);
  }
  res.status(200).json({
    success: true,
    data: data,
    message: 'get all order today successfully',
  });
});

exports.postBannedSubscriber = AsyncHandler(async (req, res, next) => {
  console.log(req.body);
  const subscriber = await Subscriber.findById(req.body.userId);

  if (!subscriber) {
    return next(
      new ErrorResponse(`Cannot find subscriber id ${req.body.userId}!!`, 401),
    );
  }
  subscriber.isBanned = true;
  await subscriber.save();
  res.status(200).json({
    success: true,
    message: 'Changed the banned status successfully',
  });
});

exports.postRecoverSubscriber = AsyncHandler(async (req, res, next) => {
  console.log(req.body);
  const subscriber = await Subscriber.findById(req.body.userId);

  if (!subscriber) {
    return next(
      new ErrorResponse(`Cannot find subscriber id ${req.body.userId}!!`, 401),
    );
  }
  subscriber.isBanned = false;
  await subscriber.save();
  res.status(200).json({
    success: true,
    message: 'Changed the banned status successfully',
  });
});
