const router = require('express').Router();
const SeriesController = require('../../../../controllers/user/film/Series/index');
const { upload } = require('../../../../middlewares/multer');

router.route('/').get(SeriesController.getAllSeries);
router.route('/series-feature').get(SeriesController.getSeriesFeature);

router.route('/create-series').post(upload, SeriesController.postCreateSeries);
router
  .route('/delete-series/:seriesId')
  .post(upload, SeriesController.postDeleteSeries);

router
  .route('/update-series/:seriesId')
  .patch(upload, SeriesController.postUpdateSeries);

module.exports = router;
