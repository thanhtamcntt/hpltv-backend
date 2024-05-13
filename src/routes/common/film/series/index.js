const router = require('express').Router();
const SeriesController = require('../../../../controllers/common/film/Series/index');

router.route('/').get(SeriesController.getAllSeries);
router.route('/from-page').get(SeriesController.getAllSeriesFromPage);

module.exports = router;
