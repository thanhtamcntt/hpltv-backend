const router = require('express').Router();
const authRouter = require('./auth/index');
const filmRouter = require('./film/index');
const categoryRouter = require('./category/index');
const manageRouter = require('./manage/index');
const summaryRouter = require('./summary/index');

router.use('/auth', authRouter);
router.use('/film', filmRouter);
router.use('/category', categoryRouter);
router.use('/manage', manageRouter);
router.use('/summary', summaryRouter);

module.exports = router;
