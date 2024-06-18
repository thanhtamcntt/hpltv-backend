const User = require('../../../models/user.js');
const Subscriber = require('../../../models/subscriber.js');
const AsyncHandler = require('express-async-handler');
const ErrorResponse = require('../../../utils/errorResponse.js');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const hashToken = require('../../../helpers/signJwtTokenUser.js');

require('dotenv').config();

exports.postLogin = AsyncHandler(async (req, res, next) => {
  console.log('body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return next(new ErrorResponse(errors.array()[0].msg, 401));
  }
  console.log('đi tới đây');
  const user = await Subscriber.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse('Account information or password is incorrect!!', 401),
    );
  }

  const hashPassword = await bcrypt.compare(req.body.password, user.password);

  console.log(hashPassword);
  if (!hashPassword) {
    return next(
      new ErrorResponse('Account information or password is incorrect!!', 401),
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    return next(new ErrorResponse(message, 401));
  }

  const hashPassword = await bcrypt.hash(req.body.password, 12);

  if (!hashPassword) {
    return next(
      new ErrorResponse(
        'The server is having problems, please try again later!!',
        401,
      ),
    );
  } else {
    const newUser = await Subscriber.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      sex: req.body.sex,
      password: hashPassword,
      createAt: Date.now(),
    });

    if (newUser) {
      return res.status(200).json({
        user: newUser,
        success: true,
        message: 'Create user successfully.',
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
  }
});
