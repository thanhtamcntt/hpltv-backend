const User = require('../../../models/user.js');
const Subscriber = require('../../../models/subscriber.js');
const AsyncHandler = require('express-async-handler');
const ErrorResponse = require('../../../utils/errorResponse.js');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const hashToken = require('../../../helpers/signJwtTokenUser.js');
const emailTemplate = require('../../../configs/mailText.js');
const emailSignupTemplate = require('../../../configs/mailSignupText.js');
const transporter = require('../../../configs/sengrid.js');
const crypto = require('crypto');
const util = require('util');
const generator = require('generate-password');
const passwordValidator = require('password-validator');
require('dotenv').config();

exports.postLogin = AsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 401));
  }
  const user = await Subscriber.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse('Account information or password is incorrect!!', 401),
    );
  }
  const hashPassword = await bcrypt.compare(req.body.password, user.password);

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

  if (user.isBanned) {
    res.status(200).json({
      success: true,
      isBanned: true,
      version: 1.0,
    });
  } else {
    res.status(200).json({
      success: true,
      isBanned: false,
      token: token,
      version: 1.0,
    });
  }
});

exports.postSignup = AsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    return next(new ErrorResponse(message, 401));
  }

  const password = generator.generate({
    length: 8,
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true,
  });

  const hashPassword = await bcrypt.hash(password, 12);

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
      try {
        transporter.sendMail({
          from: `Showhub ${process.env.EMAIL_USERNAME}`,
          to: req.body.email,
          subject: 'Requires registration of your Showhub account',
          html: emailSignupTemplate(req.body.email, password),
        });
        return res.status(200).json({
          user: newUser,
          success: true,
          message: 'Create user successfully.',
          version: 1.0,
        });
      } catch (error) {
        return next(
          new ErrorResponse('Error occurred while sending email.', 500),
        );
      }
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

exports.postForgotPassword = AsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    return next(new ErrorResponse(message, 401));
  }
  const user = await Subscriber.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('Registration email does not exist!!', 401));
  }
  const randomBytes = util.promisify(crypto.randomBytes);
  const buf = await randomBytes(32);
  const token = buf.toString('hex');
  user.resetToken = token;
  user.tokenExpiration = Date.now() + 900000;
  await user.save();
  try {
    transporter.sendMail({
      from: `Showhub ${process.env.EMAIL_USERNAME}`,
      to: req.body.email,
      subject: 'Your Showhub password reset request',
      html: emailTemplate(req.body.email, token),
    });
    return res.status(200).json({
      success: true,
      message: 'Create request password successfully.',
      version: 1.0,
    });
  } catch (error) {
    return next(new ErrorResponse('Error occurred while sending email.', 500));
  }
});

exports.postNewPassword = AsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    return next(new ErrorResponse(message, 401));
  }

  const schema = new passwordValidator();

  schema
    .is()
    .min(8)
    .is()
    .max(100)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits(1)
    .has()
    .symbols(1)
    .has()
    .not()
    .spaces();

  if (!schema.validate(req.body.newPassword)) {
    return next(
      new ErrorResponse(
        'Password must have at least 8 characters, including uppercase letters, lowercase letters, numbers and special characters.',
        401,
      ),
    );
  }

  const user = await Subscriber.findOne({
    resetToken: req.body.token,
    tokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('The token has expired!!', 401));
  }

  const hashPassword = await bcrypt.hash(req.body.newPassword, 12);

  if (!hashPassword) {
    return next(
      new ErrorResponse(
        'The server is having problems, please try again later!!',
        401,
      ),
    );
  }

  user.password = hashPassword;
  user.resetToken = undefined;
  await user.save();
  return res.status(201).json({
    success: true,
    message: 'Change new password successfully.',
    version: 1.0,
  });
});

exports.postVerifyToken = AsyncHandler(async (req, res, next) => {
  console.log(req.body);
  const user = await Subscriber.findOne({
    token: req.body.resetToken,
    tokenExpiration: { $gt: Date.now() },
  });
  console.log(user);
  if (!user) {
    return next(new ErrorResponse('The token has expired!!', 401));
  } else {
    return res.status(200).json({
      success: true,
      message: 'Valid tokens',
      version: 1.0,
    });
  }
});
