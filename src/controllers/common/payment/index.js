const Order = require('../../../models/order');
const Subscriber = require('../../../models/subscriber');
const AsyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

exports.getPayment = AsyncHandler(async (req, res, next) => {
  const paymentData = await JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../../assets/payment.json')),
  );
  res.status(200).json({
    data: paymentData,
    success: true,
    count: paymentData.length,
    message: `Get all data payment successfully.`,
  });
});

exports.getAllOrderFromPage = AsyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let count, order;
  count = await Order.find({
    // isDelete: false,
  }).sort({
    createAt: -1,
  });
  order = await Order.find({
    // isDelete: false,
  })
    .populate('userId')
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  let data = [];
  for (let i = 0; i < order.length; i++) {
    const obj = {
      firstName: order[i].userId.firstName,
      _id: order[i]._id,
      firstName: order[i].userId.firstName,
      lastName: order[i].userId.lastName,
      email: order[i].userId.email,
      typePack: order[i].information.typePack,
      monthlyPrice: order[i].information.monthlyPrice,
      information: order[i].information,
      userId: order[i].userId,
      createAt: order[i].createAt,
      expirationDate: order[i].expirationDate,
    };
    data.push(obj);
  }

  res.status(200).json({
    data: data,
    success: true,
    count: count.length,
    message: `Get all order successfully.`,
  });
});

exports.getAllOrderFetchLook = async (req, res, next) => {
  console.log(req.query);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const name = req.query.name;
  const package = req.query.package;
  let count, order;
  const subscriber = await Subscriber.find(
    {
      $or: [
        { firstName: { $regex: `.*${name}.*`, $options: 'i' } },
        { lastName: { $regex: `.*${name}.*`, $options: 'i' } },
      ],
    },
    '_id',
  );
  const subscribers = subscriber.map((sub) => sub._id);
  if (package === 'All') {
    count = await Order.find({
      userId: { $in: subscribers },
    })
      .populate('userId')
      .sort({ createAt: -1 });
    order = await Order.find({
      userId: { $in: subscribers },
    })
      .populate('userId')
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  } else {
    count = await Order.find({
      userId: { $in: subscribers },
      'information.typePack': package,
    })
      .populate('userId')
      .sort({ createAt: -1 });
    order = await Order.find({
      userId: { $in: subscribers },
      'information.typePack': package,
    })
      .populate('userId')
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }
  let data = [];
  for (let i = 0; i < order.length; i++) {
    const obj = {
      firstName: order[i].userId.firstName,
      _id: order[i]._id,
      firstName: order[i].userId.firstName,
      lastName: order[i].userId.lastName,
      email: order[i].userId.email,
      typePack: order[i].information.typePack,
      monthlyPrice: order[i].information.monthlyPrice,
      information: order[i].information,
      userId: order[i].userId,
      createAt: order[i].createAt,
      expirationDate: order[i].expirationDate,
    };
    data.push(obj);
  }

  res.status(200).json({
    data: data,
    success: true,
    count: count.length,
    message: `Get all order successfully.`,
  });
};
