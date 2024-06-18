const router = require('express').Router();
const CustomerQuestionController = require('../../../controllers/admin/setting/customerQuestion');

router
  .route('/create')
  .post(CustomerQuestionController.postCreateCustomerQuestions);

module.exports = router;
