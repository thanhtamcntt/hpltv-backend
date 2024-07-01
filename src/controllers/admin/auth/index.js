const User = require('../../../models/user.js');
const AsyncHandler = require('express-async-handler');
const ErrorResponse = require('../../../utils/errorResponse.js');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const hashToken = require('../../../helpers/signJwtTokenUser.js');
const path = require('path');
const fs = require('fs');
const Subscriber = require('../../../models/subscriber.js');

exports.postLogin = AsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return next(new ErrorResponse(errors.array()[0].msg, 401));
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ErrorResponse('Account information or password is incorrect', 401),
    );
  }

  const hashPassword = await bcrypt.compare(req.body.password, user.password);

  if (!hashPassword) {
    return next(
      new ErrorResponse('Account information or password is incorrect', 401),
    );
  }
  const userInfo = {
    userId: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUser: user.avatarUser,
    phoneNumber: user.phoneNumber,
    role: user.role,
    sex: user.sex,
  };
  const token = await hashToken(userInfo);
  res.status(200).json({
    success: true,
    token: token,
    version: 1.0,
  });
});

exports.postSignup = AsyncHandler(async (req, res, next) => {
  const user = await JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../../assets/user.json')),
  );
  console.log(user);
  user.forEach(async (item, id) => {
    console.log('index', id, item);
    const hashPassword = await bcrypt.hash(item.password, 12);

    if (id === 0) {
      await User.create({
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        phoneNumber: item.phoneNumber,
        sex: item.sex,
        role: 'superAdmin',
        password: hashPassword,
        createAt: Date.now(),
      });
    } else {
      await User.create({
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        phoneNumber: item.phoneNumber,
        sex: item.sex,
        role: 'admin',
        password: hashPassword,
        createAt: Date.now(),
      });
    }
  });
});

exports.postResetPassword = AsyncHandler(async (req, res, next) => {
  console.log(req.body);
  const hashPassword = await bcrypt.hash('123456', 12);
  console.log(hashPassword);
  let user;
  if (req.body.type === 'user') {
    user = await User.findById(req.body.userId);
  } else {
    user = await Subscriber.findById(req.body.userId);
  }

  if (!user) {
    return next(
      new ErrorResponse(
        `Cannot find ${req.body.type} id ${req.body.userId}!!`,
        401,
      ),
    );
  }
  user.password = hashPassword;
  await user.save();
  res.status(200).json({
    success: true,
    newPassword: hashPassword,
    version: 1.0,
  });
});

exports.deleteUser = AsyncHandler(async (req, res, next) => {
  console.log(req.body);
  if (req.body.type === 'user') {
    await User.findByIdAndDelete(req.body.userId);
  } else {
    await Subscriber.findByIdAndDelete(req.body.userId);
  }
  res.status(200).json({
    success: true,
    version: 1.0,
  });
});
