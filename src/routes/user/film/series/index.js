const router = require('express').Router();
const SeriesController = require('../../../../controllers/user/film/Series/index');

router.route('/series-feature').get(SeriesController.getSeriesFeature);

module.exports = router;
