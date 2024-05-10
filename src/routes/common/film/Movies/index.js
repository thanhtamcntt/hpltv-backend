const router = require('express').Router();
const MoviesController = require('../../../../controllers/common/film/Movies/index');

router.route('/').get(MoviesController.getAllMovies);
router.route('/from-page').get(MoviesController.getAllMoviesFromPage);

module.exports = router;
