const router = require('express').Router();
const authRouter = require('./auth/index');
const filmRouter = require('./film/index');
const categoryRouter = require('./category/index');
const paymentRouter = require('./payment/index');

router.use('/auth', authRouter);
router.use('/film', filmRouter);
router.use('/category', categoryRouter);
router.use('/payment', paymentRouter);

module.exports = router;
