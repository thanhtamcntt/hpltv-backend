const User = require('../../models/user');
const Subscriber = require('../../models/subscriber');
const AsyncHandler = require('express-async-handler');
const ErrorResponse = require('../../utils/errorResponse');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const hashToken = require('../../helpers/signJwtToken.js');

exports.postLogin = AsyncHandler(async (req, res, next) => {
  console.log('body', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors.array(), 401);
  }
  let admin = false;
  let newUser;
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    admin = true;
    newUser = user;
  }

  const subscriber = await Subscriber.findOne({ email: req.body.email });
  if (subscriber) {
    newUser = subscriber;
  }
  console.log(newUser);
  const hashPassword = await bcrypt.compare(
    req.body.password,
    newUser.password,
  );

  console.log(hashPassword);
  if (!hashPassword) {
    return next(
      new ErrorResponse('Account information or password is incorrect', 401),
    );
  }
  const token = await hashToken(newUser._id);
  res.status(200).json({
    admin: admin,
    success: true,
    user: newUser,
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
      username: req.body.username,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
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
