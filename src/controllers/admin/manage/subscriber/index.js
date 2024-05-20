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

exports.getSubscriberToday = AsyncHandler(async (req, res, next) => {
  const currentDate = new Date();
  const startOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  );
  const endOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1,
  );

  const subscriber = await Subscriber.find({
    createAt: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  })
    .sort({ createAt: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    data: subscriber,
    message: 'get all subscriber to day successfully',
  });
});

exports.getSubscriberOrderToday = AsyncHandler(async (req, res, next) => {
  const currentDate = new Date();
  const startOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  );
  const endOfDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1,
  );

  const order = await Order.find({
    createAt: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  })
    .populate('userId')
    .sort({ createAt: -1 })
    .limit(10);

  let data = [];
  for (let i = 0; i < order.length; i++) {
    const obj = {
      firstName: order[i].userId.firstName,
      lastName: order[i].userId.lastName,
      typePack: order[i].information.typePack,
      monthlyPrice: order[i].information.monthlyPrice,
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
