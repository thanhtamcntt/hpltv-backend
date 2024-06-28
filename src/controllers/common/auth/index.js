const AsyncHandler = require('express-async-handler');
const User = require('../../../models/user.js');
const Subscriber = require('../../../models/subscriber.js');
const ErrorResponse = require('../../../utils/errorResponse.js');
const bcrypt = require('bcryptjs');
const hashToken = require('../../../helpers/signJwtTokenUser.js');
const { deleteImageCloud } = require('../../../helpers/uploadImage.js');
const passwordValidator = require('password-validator');
require('dotenv').config();

exports.getVerifyUserToken = AsyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    userInfo: req.user,
    version: 1.0,
  });
});

exports.postUpdateProfile = AsyncHandler(async (req, res, next) => {
  console.log(req.query);
  let user;
  if (req.query.user === 'user') {
    user = await User.findOne({
      _id: { $ne: req.user.userId },
      $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
    });
  } else {
    user = await Subscriber.findOne({
      _id: { $ne: req.user.userId },
      $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
    });
  }
  console.log(user);
  if (user) {
    return res.status(401).json({
      success: false,
      message: `Email or phone number is already used!!`,
      version: 1.0,
    });
  } else {
    let userUpdate;
    if (req.query.user === 'user') {
      userUpdate = await User.findById(req.user.userId);
    } else {
      userUpdate = await Subscriber.findById(req.user.userId);
    }
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

  if (req.body.confirmNewPassword !== req.body.newPassword) {
    return next(
      new ErrorResponse('Confirmation password does not match!!', 401),
    );
  }

  let user;
  if (req.query.user === 'user') {
    user = await User.findById(req.user.userId);
  } else {
    user = await Subscriber.findById(req.user.userId);
  }
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
  let user;
  if (req.query.user === 'user') {
    user = await User.findById(req.user.userId);
  } else {
    user = await Subscriber.findById(req.user.userId);
  }
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
  let user;
  if (req.query.user === 'user') {
    user = await User.findById(req.user.userId);
  } else {
    user = await Subscriber.findById(req.user.userId);
  }
  if (!user) {
    return next(new ErrorResponse('User not found!!', 401));
  }
  console.log('tới đây');
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
