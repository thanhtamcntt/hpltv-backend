const router = require('express').Router();
const seriesRouter = require('./series/index');
const moviesRouter = require('./Movies/index');


router.use('/movies', moviesRouter);
router.use('/series', seriesRouter);

module.exports = router;
