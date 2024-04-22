const router = require('express').Router();
const MoviesController = require('../../../../controllers/common/film/Movies/index');


router.route('/').get(MoviesController.getAllMovies);


module.exports = router;
