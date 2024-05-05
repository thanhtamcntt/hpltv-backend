const router = require('express').Router();
const SeriesController = require('../../../../controllers/admin/film/Series/index');
const { upload } = require('../../../../helpers/multer');
const { uploadCsv } = require('../../../../middlewares/addFileCsv');

router.route('/create-series').post(upload, SeriesController.postCreateSeries);
router
  .route('/delete-series/:seriesId')
  .post(upload, SeriesController.postDeleteSeries);

router
  .route('/update-series/:seriesId')
  .patch(upload, SeriesController.postUpdateSeries);

router
  .route('/add-many-series')
  .post(uploadCsv, SeriesController.posAddManySeries);

module.exports = router;
