const router = require('express').Router();
const {
  getAllSubscriber,
} = require('../../../../controllers/admin/manage/subscriber');
const CheckToken = require('../../../../middlewares/checkToken');
const checkRoles = require('../../../../middlewares/checkRoles');

router.route('/').get(CheckToken, getAllSubscriber);

module.exports = router;
