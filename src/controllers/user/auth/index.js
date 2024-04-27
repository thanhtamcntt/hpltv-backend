const User = require('../../../models/user.js');
const Subscriber = require('../../../models/subscriber.js');
const AsyncHandler = require('express-async-handler');
const ErrorResponse = require('../../../utils/errorResponse.js');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const hashToken = require('../../../helpers/signJwtTokenUser.js');
const { deleteImageCloud } = require('../../../helpers/uploadImage.js');
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

exports.postUpdateProfile = AsyncHandler(async (req, res, next) => {
  const user = await Subscriber.findOne({
    _id: { $ne: req.user.userId },
    $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
  });
  if (user) {
    return res.status(401).json({
      success: false,
      message: `Email or phone number is already used!!`,
      version: 1.0,
    });
  } else {
    const userUpdate = await Subscriber.findById(req.user.userId);
    userUpdate.firstName = req.body.firstName;
    userUpdate.lastName = req.body.lastName;
    userUpdate.email = req.body.email;
    userUpdate.phoneNumber = req.body.phoneNumber;
    userUpdate.sex = req.body.sex;
    await userUpdate.save();
    const hashUser = {
      ...userUpdate._doc,
      userId: req.user.userId,
    };
    delete hashUser._id;
    delete hashUser.password;

    const token = await hashToken(hashUser);
    return res.status(200).json({
      token: token,
      success: true,
      message: `Update profile user id ${req.user.userId} successfully.`,
      version: 1.0,
    });
  }
});

exports.postChangePassword = AsyncHandler(async (req, res, next) => {
  console.log(req.body);

  if (req.body.confirmNewPassword !== req.body.newPassword) {
    return next(
      new ErrorResponse('Confirmation password does not match!!', 401),
    );
  }

  const user = await Subscriber.findById(req.user.userId);
  if (!user) {
    return next(new ErrorResponse('User not found!!', 401));
  }

  const checkPassword = bcrypt.compare(user.password, req.body.currentPassword);

  if (!checkPassword) {
    return next(new ErrorResponse('Current password is incorrect!!', 401));
  }

  const hashPassword = await bcrypt.hash(req.body.newPassword, 12);

  if (!hashPassword) {
    return next(
      new ErrorResponse(
        'The server is having problems, please try again later!!',
        401,
      ),
    );
  } else {
    user.password = hashPassword;
    await user.save();
    const hashUser = {
      ...user._doc,
      userId: req.user.userId,
    };
    delete hashUser._id;
    delete hashUser.password;

    const token = await hashToken(hashUser);
    return res.status(200).json({
      token: token,
      success: true,
      message: `Change password user id ${req.user.userId} successfully.`,
      version: 1.0,
    });
  }
});

exports.postChangeAvatarProfile = AsyncHandler(async (req, res, next) => {
  const user = await Subscriber.findById(req.user.userId);
  console.log(user);
  if (!user) {
    return next(new ErrorResponse('User not found!!', 401));
  }
  if (!req.files['imageAvatar']) {
    return next(
      new ErrorResponse(`Please enter a valid file image and video`, 404),
    );
  }
  const infoImage = {
    imageId: req.files['imageAvatar'][0].filename,
    url: req.files['imageAvatar'][0].path,
  };

  user.avatarUser = infoImage;
  await user.save();
  const hashUser = {
    ...user._doc,
    userId: req.user.userId,
  };
  delete hashUser._id;
  delete hashUser.password;

  const token = await hashToken(hashUser);
  return res.status(200).json({
    token: token,
    success: true,
    message: `Update avatar profile user id ${req.user.userId} successfully.`,
    version: 1.0,
  });
});

exports.postDeleteAvatarProfile = AsyncHandler(async (req, res, next) => {
  const user = await Subscriber.findById(req.user.userId);
  if (!user) {
    return next(new ErrorResponse('User not found!!', 401));
  }
  await deleteImageCloud(req.body.imageUser.imageId);

  user.avatarUser.imageId = process.env.IMAGE_ID_DEFAULT;
  user.avatarUser.url = process.env.IMAGE_URL_DEFAULT;
  await user.save();
  const hashUser = {
    ...user._doc,
    userId: req.user.userId,
  };
  delete hashUser._id;
  delete hashUser.password;
  const token = await hashToken(hashUser);
  return res.status(200).json({
    token: token,
    success: true,
    message: `Update avatar profile user id ${req.user.userId} successfully.`,
    version: 1.0,
  });
});
