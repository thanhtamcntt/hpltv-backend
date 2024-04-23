const Movies = require('../../../../models/movies');


exports.getAllMovies = async (req, res, next) => {
  const movies = await Movies.find().sort({ createAt: -1 });

  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get all movies successfully.`,
  });
};





