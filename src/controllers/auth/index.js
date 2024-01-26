const User = require('../../models/user');
const Subscriber = require('../../models/subscriber');
const AsyncHandler = require('express-async-handler');
const ErrorResponse = require('../../utils/errorResponse');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const hashToken = require('../../helpers/signJwtToken.js');
const {
  createImageAvatar,
  deleteImageCloud,
} = require('../../helpers/uploadImage');

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
  const token = await hashToken(newUser);
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
    _id: { $ne: req.user._id },
    $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
  });
  if (user) {
    return res.status(401).json({
      success: false,
      message: `Email or phone number is already used!!`,
      version: 1.0,
    });
  } else {
    const userUpdate = await Subscriber.findById(req.user._id);
    userUpdate.firstName = req.body.firstName;
    userUpdate.lastName = req.body.lastName;
    userUpdate.email = req.body.email;
    userUpdate.phoneNumber = req.body.phoneNumber;
    userUpdate.sex = req.body.sex;
    await userUpdate.save();
    return res.status(200).json({
      user: userUpdate,
      success: true,
      message: `Update profile user id ${req.user._id} successfully.`,
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

  const checkPassword = bcrypt.compare(
    req.user.password,
    req.body.currentPassword,
  );

  if (!checkPassword) {
    return next(new ErrorResponse('Current password is incorrect!!', 401));
  }

  const user = await Subscriber.findById(req.user._id);
  if (!user) {
    return next(new ErrorResponse('User not found!!', 401));
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
    return res.status(200).json({
      user: user,
      success: true,
      message: `Change password user id ${req.user._id} successfully.`,
      version: 1.0,
    });
  }
});

exports.postChangeAvatarProfile = AsyncHandler(async (req, res, next) => {
  const user = await Subscriber.findById(req.user._id);
  if (!user) {
    return next(new ErrorResponse('User not found!!', 401));
  }
  console.log(req.files.imageUrl);
  if (!req.files.imageUrl) {
    return next(
      new ErrorResponse(`Please enter a valid file image and video`, 404),
    );
  }
  const infoImage = await createImageAvatar(req.files.imageUrl);

  user.avatarUser = infoImage;
  await user.save();
  return res.status(200).json({
    imageUpdate: infoImage,
    success: true,
    message: `Update avatar profile user id ${req.user._id} successfully.`,
    version: 1.0,
  });
});

exports.postDeleteAvatarProfile = AsyncHandler(async (req, res, next) => {
  console.log('req body', req.body);
  const user = await Subscriber.findById(req.user._id);
  if (!user) {
    return next(new ErrorResponse('User not found!!', 401));
  }
  await deleteImageCloud(req.body.imageUser.imageId);

  user.avatarUser.imageId = 'image-webFilm/bn7cwddncp0ls6rlyczw';
  user.avatarUser.url =
    'https://res.cloudinary.com/dzxupp48t/image/upload/v1705319817/image-webFilm/bn7cwddncp0ls6rlyczw.png';
  await user.save();
  return res.status(200).json({
    imageUpdate: user.avatarUser,
    success: true,
    message: `Update avatar profile user id ${req.user._id} successfully.`,
    version: 1.0,
  });
});
