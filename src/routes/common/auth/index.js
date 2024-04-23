const router = require('express').Router();
const {
getVerifyUserToken
} = require('../../../controllers/common/auth/index');

const CheckToken = require('../../../middlewares/checkToken');


router.route('/verify-token').get(CheckToken, getVerifyUserToken);

module.exports = router;
