const router = require('express').Router();
const MoviesController = require('../../../controllers/film/Movies/index');
const { upload } = require('../../../middlewares/multer');

router.route('/').get(MoviesController.getAllMovies);

router.route('/movies-feature').get(MoviesController.getMoviesFeature);

router.route('/most-new').get(MoviesController.getMoviesMostNew);

router.route('/most-view').get(MoviesController.getMoviesMostView);

router.route('/most-rating').get(MoviesController.getMoviesMostRating);

router
  .route('/can-to-match/:filmId')
  .get(MoviesController.getMoviesCanWantToMatch);

router.route('/create-movies').post(upload, MoviesController.postCreateMovies);
router
  .route('/delete-movies/:moviesId')
  .post(upload, MoviesController.postDeleteMovies);

router
  .route('/update-movies/:moviesId')
  .post(upload, MoviesController.postUpdateMovies);

module.exports = router;
