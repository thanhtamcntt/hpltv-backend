const router = require('express').Router();
const authRouter = require('./auth/index');
const filmRouter = require('./film/index');
const categoryRouter = require('./category/index');

router.use('/auth', authRouter);
router.use('/film', filmRouter);
router.use('/category', categoryRouter);


module.exports = router;