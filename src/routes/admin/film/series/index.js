const router = require('express').Router();
const SeriesController = require('../../../../controllers/admin/film/Series/index');
const FilmForSeriesRouter = require('../filmForSeries/index');
const { upload } = require('../../../../helpers/multer');
const { uploadCsv } = require('../../../../middlewares/addFileCsv');

router.use('/:seriesId', FilmForSeriesRouter);

router.route('/create-series').post(upload, SeriesController.postCreateSeries);
router
  .route('/delete-series/:seriesId')
  .post(SeriesController.postDeleteSeries);

router
  .route('/update-series/:seriesId')
  .patch(upload, SeriesController.postUpdateSeries);

router.route('/recover-series').post(SeriesController.postRecoverSeries);

module.exports = router;
