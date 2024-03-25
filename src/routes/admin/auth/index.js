const router = require('express').Router();

const { body } = require('express-validator');
const User = require('../../../models/user');
const Subscriber = require('../../../models/subscriber');
const CheckToken = require('../../../middlewares/checkToken');
const {
  postSignup,
  postLogin,
  getVerifyUserToken,
} = require('../../../controllers/admin/auth/index');

router
  .route('/login')
  .post(
    [
      body('email', 'Please enter the correct email format')
        .isEmail()
        .normalizeEmail(),
      body('password', 'Please enter your password at least 6 characters!!')
        .trim()
        .isAlphanumeric()
        .isLength({ min: 6 }),
    ],
    postLogin,
  );
router.route('/signup').get(postSignup);
router.route('/verify-token').get(CheckToken, getVerifyUserToken);

module.exports = router;
