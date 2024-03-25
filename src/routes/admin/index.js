const router = require('express').Router();
const authRouter = require('./auth/index');
const filmRouter = require('./film/index');

router.use('/auth', authRouter);
router.use('/film', filmRouter);

module.exports = router;
