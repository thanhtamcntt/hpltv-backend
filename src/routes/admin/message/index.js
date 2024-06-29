const router = require('express').Router();
const MessageController = require('../../../controllers/admin/message');

router.route('/create').post(MessageController.postCreateMessage);
router.route('/update/:roomId').patch(MessageController.postUpdateMessage);
router.route('/update-off/:roomId').post(MessageController.postUpdateOff);
// router.route('/change-status').post(MessageController.postChangeStatus);
// router
//   .route('/update-category/:categoryId')
//   .patch(CategoryController.postUpdateCategory);
// router
//   .route('/delete-category/:categoryId')
//   .post(CategoryController.postDeleteCategory);

module.exports = router;
