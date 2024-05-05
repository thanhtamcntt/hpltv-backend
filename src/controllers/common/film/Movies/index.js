const Movies = require('../../../../models/movies');

exports.getAllMovies = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const count = await Movies.find().sort({ createAt: -1 });
  const movies = await Movies.find()
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    data: movies,
    success: true,
    count: count.length,
    message: `Get all movies successfully.`,
  });
};
