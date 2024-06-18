const router = require('express').Router();
const {
  postSignup,
  postLogin,
} = require('../../../controllers/user/auth/index');
const { body } = require('express-validator');
const User = require('../../../models/user');
const Subscriber = require('../../../models/subscriber');

router.route('/signup').post(
  [
    body('firstName', 'Please enter your first name at least 3 characters!!')
      .trim()
      .isLength({ min: 3 }),
    body('lastName', 'Please enter your last name at least 3 characters!!')
      .trim()
      .isLength({ min: 3 }),
    body('email', 'Please enter email in correct format!!')
      .isEmail()
      .normalizeEmail()
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        const subscriber = await Subscriber.findOne({ email: value });
        if (user || subscriber) {
          throw new Error('Email is registered in the system!!');
        }
      }),
    body('phoneNumber', 'Please enter your phone number!!').isMobilePhone(),
    body('password', 'Please enter your password at least 6 characters!!')
      .trim()
      .isAlphanumeric()
      .isLength({ min: 6 }),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm password has to match with you password!!');
      }
      return true;
    }),
  ],
  postSignup,
);

router
  .route('/login')
  .post(
    [
      body('email', 'Please enter email in correct format!!')
        .isEmail()
        .normalizeEmail(),
      body('password', 'Please enter your password at least 6 characters!!')
        .trim()
        .isAlphanumeric()
        .isLength({ min: 6 }),
    ],
    postLogin,
  );

module.exports = router;
