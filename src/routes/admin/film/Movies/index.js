const router = require('express').Router();
const MoviesController = require('../../../../controllers/user/film/Movies/index');
const { upload } = require('../../../../middlewares/multer');
const CheckToken = require('../../../../middlewares/checkToken');
const CheckRoles = require('../../../../middlewares/checkRoles');

router.route('/').get(MoviesController.getAllMovies);

router
  .route('/create-movies')
  .post(CheckToken, upload, MoviesController.postCreateMovies);
router
  .route('/delete-movies/:moviesId')
  .post(upload, MoviesController.postDeleteMovies);

router
  .route('/update-movies/:moviesId')
  .post(upload, MoviesController.postUpdateMovies);

// router.route('/test').get(MoviesController.getMovieTest);

module.exports = router;
