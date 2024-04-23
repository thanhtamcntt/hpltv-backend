const router = require('express').Router();

const { body } = require('express-validator');

const CheckToken = require('../../../middlewares/checkToken');
const checkRoles = require('../../..//middlewares/checkRoles');
const {
  postSignup,
  postLogin,
  postResetPassword,
  deleteUser,
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
router.route('/reset-password').post(CheckToken, postResetPassword);
router.route('/delete-user').post(CheckToken, deleteUser);

module.exports = router;
