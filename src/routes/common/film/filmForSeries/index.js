const router = require('express').Router({ mergeParams: true });
const {
  getAllFilmForSeries,
  getAllFilmForSeriesFromPage,
} = require('../../../../controllers/common/film/filmForSeries');

router.route('/').get(getAllFilmForSeries);
router.route('/from-page').get(getAllFilmForSeriesFromPage);

module.exports = router;
