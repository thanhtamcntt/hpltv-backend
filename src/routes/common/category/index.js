const router = require('express').Router();
const CategoryController = require('../../../controllers/common/category/index');

router.route('/').get(CategoryController.getAllCategory);


module.exports = router;
