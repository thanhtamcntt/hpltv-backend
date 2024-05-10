const router = require('express').Router({ mergeParams: true });
const {
  getAllFilmForSeries,
} = require('../../../../../controllers/admin/film/filmForSeries/index');
const { upload } = require('../../../../../helpers/multer');
const { uploadCsv } = require('../../../../../middlewares/addFileCsv');

router.route('/').get(getAllFilmForSeries);

module.exports = router;
