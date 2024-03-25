const router = require('express').Router();
const userRouter = require('./user/index');
const adminRouter = require('./admin/index');

router.use('/', userRouter);
router.use('/admin', adminRouter);

module.exports = router;
