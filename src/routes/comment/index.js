const router = require('express').Router();
const CommentController = require('../../controllers/comment/index');
const CheckToken = require('../../middlewares/checkToken');

router.route('/').get(CheckToken, CommentController.getAllComment);
router.route('/add-comment').post(CheckToken, CommentController.postAddComment);

module.exports = router;
