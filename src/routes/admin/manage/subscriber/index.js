const router = require('express').Router();
const {
  getAllSubscriber,
  getSubscriberToday,
  getSubscriberOrderToday,
  postBannedSubscriber,
  postRecoverSubscriber,
} = require('../../../../controllers/admin/manage/subscriber');
const CheckToken = require('../../../../middlewares/checkToken');
const checkRoles = require('../../../../middlewares/checkRoles');

router.route('/').get(CheckToken, getAllSubscriber);
router.route('/subscriber-today').get(getSubscriberToday);
router.route('/subscriber-order-today').get(getSubscriberOrderToday);
router.route('/banned-subscriber').post(postBannedSubscriber);
router.route('/recover-subscriber').post(postRecoverSubscriber);

module.exports = router;
