const router = require('express').Router();
const CheckToken = require('../../../middlewares/checkToken');
const {
  postAddPaymentUser,
  postPackageOrder,
  getAllOrder,
} = require('../../../controllers/user/order/index');

router.route('/').get(CheckToken, getAllOrder);
router.route('/post-package-order').post(CheckToken, postPackageOrder);
router.route('/subscription-package').post(CheckToken, postAddPaymentUser);

module.exports = router;
