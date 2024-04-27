const router = require('express').Router();
const MoviesController = require('../../../../controllers/admin/film/Movies/index');
const { upload } = require('../../../../middlewares/multer');
const CheckToken = require('../../../../middlewares/checkToken');
const CheckRoles = require('../../../../middlewares/checkRoles');
const { uploadCsv } = require('../../../../middlewares/addFileCsv');

router
  .route('/create-movies')
  .post(CheckToken, upload, MoviesController.postCreateMovies);
router
  .route('/delete-movies/:moviesId')
  .post(upload, MoviesController.postDeleteMovies);

router
  .route('/update-movies/:moviesId')
  .post(upload, MoviesController.postUpdateMovies);

router
  .route('/add-many-movies')
  .post(uploadCsv, MoviesController.postAddManyMovies);
// router.route('/test').get(MoviesController.getMovieTest);

module.exports = router;
