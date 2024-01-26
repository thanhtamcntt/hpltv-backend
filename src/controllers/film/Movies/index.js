const Movies = require('../../../models/movies');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const {
  createImageCloud,
  deleteImageCloud,
} = require('../../../helpers/uploadImage');
const {
  createVideoCloud,
  deleteVideoCloud,
} = require('../../../helpers/uploadVideo');

exports.getAllMovies = async (req, res, next) => {
  const movies = await Movies.find().sort({ createAt: -1 });

  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get all movies successfully.`,
  });
};

exports.getMoviesFeature = async (req, res, next) => {
  const movies = await Movies.find().sort({ createAt: -1 }).limit(10);

  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get movies feature successfully.`,
  });
};

exports.getMoviesMostNew = async (req, res, next) => {
  const movies = await Movies.find().sort({ createAt: -1 }).limit(6);

  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get movies feature successfully.`,
  });
};

exports.getMoviesMostView = async (req, res, next) => {
  const movies = await Movies.find().sort({ view: -1 }).limit(6);

  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get movies feature successfully.`,
  });
};

exports.getMoviesMostRating = async (req, res, next) => {
  const movies = await Movies.find().sort({ rating: -1 }).limit(6);

  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get movies feature successfully.`,
  });
};

exports.getMoviesCanWantToMatch = async (req, res, next) => {
  const film = await Movies.findById(req.params.filmId);

  if (!film) {
    return next(
      new ErrorResponse(`Cannot find movies id ${req.params.filmId}!!`, 401),
    );
  }
  const movies = await Movies.find({
    listCategoryId: { $in: film.listCategoryId },
  })
    .sort({ createAt: -1 })
    .limit(10);
  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get movies feature successfully.`,
  });
};

exports.postCreateMovies = AsyncHandler(async (req, res, next) => {
  console.log('postCreateMovies', req.body);
  if (!req.files.imageUrl || !req.files.videoUrl) {
    return next(
      new ErrorResponse(`Please enter a valid file image and video`, 404),
    );
  }
  const infoImage = await createImageCloud(req.files.imageUrl);
  const infoVideo = await createVideoCloud(req.files.videoUrl);

  const movies = await Movies.create({
    title: req.body.title,
    releaseDate: req.body.releaseDate,
    description: req.body.description,
    director: req.body.director,
    cast: req.body.cast,
    country: req.body.country,
    productCompany: req.body.productCompany,
    duration: infoVideo.duration,
    imageUrl: infoImage,
    videoUrl: infoVideo.videoUrl,
    createAt: Date.now(),
    listCategoryId: req.body.listCategoryId.split(','),
    createBy: '6543c28ae4b2dbdf546106c3',
  });

  if (!movies) {
    return next(
      new ErrorResponse(
        `The system is experiencing problems, please try again later!!`,
        401,
      ),
    );
  }

  res.status(201).json({
    success: true,
    data: movies,
    message: 'Create movies successfully',
  });
});

exports.postDeleteMovies = AsyncHandler(async (req, res, next) => {
  console.log(req.params);
  if (!req.params.moviesId) {
    return next(
      new ErrorResponse(`Please enter a valid id movies delete`, 404),
    );
  }

  const movies = await Movies.deleteOne({ _id: req.params.moviesId });

  if (!movies) {
    return next(
      new ErrorResponse(
        `The system is experiencing problems, please try again later!!`,
        401,
      ),
    );
  }
  await deleteImageCloud(movies.imageUrl.imageId);
  await deleteVideoCloud(movies.videoUrl.videoId);

  res.status(201).json({
    success: true,
    data: movies,
    message: `delete movies ${req.params.moviesId} successfully`,
  });
});

exports.postUpdateMovies = AsyncHandler(async (req, res, next) => {
  const movies = await Movies.findById(req.params.moviesId);

  if (!movies) {
    return next(
      new ErrorResponse(`Cannot find movies id ${req.params.moviesId}!!`, 401),
    );
  }
  await deleteImageCloud(movies.imageUrl.imageId);
  await deleteVideoCloud(movies.videoUrl.videoId);

  const infoImage = await createImageCloud(req.files.imageUrl);
  const infoVideo = await createVideoCloud(req.files.videoUrl);

  movies.title = req.body.title;
  movies.releaseDate = req.body.releaseDate;
  movies.description = req.body.description;
  movies.director = req.body.director;
  movies.cast = req.body.cast;
  movies.country = req.body.country;
  movies.productCompany = req.body.productCompany;
  movies.duration = infoVideo.duration;
  movies.imageUrl = infoImage;
  movies.videoUrl = infoVideo.videoUrl;
  movies.listCategoryId = req.body.listCategoryId.split(',');
  movies.updateAt = Date.now();
  await movies.save();

  res.status(201).json({
    success: true,
    data: movies,
    message: `update movies ${req.params.moviesId} successfully`,
  });
});
