const Movies = require('../../../../models/movies');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const { deleteImageCloud } = require('../../../../helpers/uploadImage');
const { deleteVideoCloud } = require('../../../../helpers/uploadVideo');
const { getVideoDurationInSeconds } = require('get-video-duration');
const csv = require('csvtojson');
const DeleteFile = require('../../../../utils/deleteFile');

exports.postCreateMovies = AsyncHandler(async (req, res, next) => {
  console.log('postCreateMovies', req.body);
  if (!req.files['imageUrl'] || !req.files['videoUrl']) {
    return next(
      new ErrorResponse(`Please enter a valid file image and video`, 404),
    );
  }

  console.log(req.files['imageUrl'], req.files['videoUrl']);
  const infoImage = {
    imageId: req.files['imageUrl'][0].filename,
    url: req.files['imageUrl'][0].path,
  };
  const infoVideo = {
    videoId: req.files['videoUrl'][0].filename,
    url: req.files['videoUrl'][0].path,
  };

  const duration = await getVideoDurationInSeconds(
    req.files['videoUrl'][0].path,
  );
  let resultDuration;
  if (duration % 60 < 5) {
    resultDuration = Math.floor(duration / 60);
  } else {
    resultDuration = Math.ceil(duration / 60);
  }

  const movies = await Movies.create({
    title: req.body.title,
    releaseDate: req.body.releaseDate,
    description: req.body.description,
    director: req.body.director,
    cast: req.body.cast,
    country: req.body.country,
    productCompany: req.body.productCompany,
    duration: resultDuration,
    imageUrl: infoImage,
    videoUrl: infoVideo,
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

  const movies = await Movies.findOne({ _id: req.params.moviesId });

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

  await Movies.deleteOne({ _id: req.params.moviesId });

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

  const infoImage = {
    imageId: req.files['imageUrl'].filename,
    url: req.files['imageUrl'].path,
  };
  const infoVideo = {
    videoId: req.files['videoUrl'][0].filename,
    url: req.files['videoUrl'][0].path,
  };

  const duration = await getVideoDurationInSeconds(
    req.files['videoUrl'][0].path,
  );
  let resultDuration;
  if (duration % 60 < 5) {
    resultDuration = Math.floor(duration / 60);
  } else {
    resultDuration = Math.ceil(duration / 60);
  }

  movies.title = req.body.title;
  movies.releaseDate = req.body.releaseDate;
  movies.description = req.body.description;
  movies.director = req.body.director;
  movies.cast = req.body.cast;
  movies.country = req.body.country;
  movies.productCompany = req.body.productCompany;
  movies.duration = resultDuration;
  movies.imageUrl = infoImage;
  movies.videoUrl = infoVideo;
  movies.listCategoryId = req.body.listCategoryId.split(',');
  movies.updateAt = Date.now();
  await movies.save();

  res.status(201).json({
    success: true,
    data: movies,
    message: `update movies ${req.params.moviesId} successfully`,
  });
});

exports.postHandleLikeMovies = AsyncHandler(async (req, res, next) => {
  console.log(req.body);
  const movies = await Movies.findById(req.body.filmId);
  if (!movies) {
    return next(
      new ErrorResponse(`Cannot find movies id ${req.body.filmId}!!`, 401),
    );
  }
  try {
    let updatedDocument;
    if (!req.body.isLike) {
      updatedDocument = await Movies.findByIdAndUpdate(
        req.body.filmId,
        { $push: { listUserIdLike: req.body.userId } },
        { new: true },
      );
    } else {
      updatedDocument = await Movies.findByIdAndUpdate(
        req.body.filmId,
        { $pull: { listUserIdLike: req.body.userId } },
        { new: true },
      );
    }

    console.log(updatedDocument);

    res.status(201).json({
      success: true,
      data: updatedDocument,
      message: `Update list id user like movies ${req.body.filmId} successfully`,
    });
  } catch (err) {
    console.error(err);
    return next(
      new ErrorResponse(`Error updating movies: ${err.message}`, 500),
    );
  }
});

exports.postHandleRatingMovies = AsyncHandler(async (req, res, next) => {
  const movies = await Movies.findById(req.body.filmId);
  if (!movies) {
    return next(
      new ErrorResponse(`Cannot find movies id ${req.body.filmId}!!`, 401),
    );
  }

  if (
    !movies.listUserIdRating.some(
      (data) => data.userId.toString() === req.body.userId.toString(),
    )
  ) {
    const newRating =
      Math.round(
        ((movies.totalRating * movies.rating + req.body.valueRating) /
          (movies.totalRating + 1)) *
          10,
      ) / 10;
    const newTotalRating = movies.totalRating + 1;
    try {
      const updatedDocument = await Movies.findByIdAndUpdate(
        req.body.filmId,
        {
          rating: newRating,
          totalRating: newTotalRating,
          $push: {
            listUserIdRating: {
              userId: req.body.userId,
              valueRating: req.body.valueRating,
            },
          },
        },
        { new: true },
      );

      console.log('update document nè:', updatedDocument);

      res.status(201).json({
        success: true,
        data: updatedDocument,
        message: `Update list id user like movies ${req.body.filmId} successfully`,
      });
    } catch (err) {
      console.error(err);
      return next(
        new ErrorResponse(`Error updating movies: ${err.message}`, 500),
      );
    }
  } else {
    return next(
      new ErrorResponse(
        `User id ${req.body.userId} liked movies ${req.body.filmId} !!`,
        401,
      ),
    );
  }
});

exports.postAddManyMovies = AsyncHandler(async (req, res, next) => {
  console.log(req.file.path);
  const jsonArray = await csv().fromFile(req.file.path);
  console.log(jsonArray);
  count = 0;
  Promise.all(
    jsonArray.map(async (item, id) => {
      if (
        item.title === '' ||
        item.description === '' ||
        item.imageId === '' ||
        item.imageUrl === '' ||
        item.videoId === '' ||
        item.videoUrl === '' ||
        item.releaseDate === '' ||
        item.director === '' ||
        item.cast === '' ||
        item.country === '' ||
        item.duration === '' ||
        item.productCompany === '' ||
        item.listCategoryId === ''
      ) {
        count = id + 1;
        return next(
          new ErrorResponse(
            `Detect errors in excel data in line numbers ${count}!!`,
            401,
          ),
        );
      }
    }),
  );

  Promise.all(
    jsonArray.map(async (item, id) => {
      await Movies.create({
        title: item.title,
        releaseDate: item.releaseDate,
        description: item.description,
        director: item.director,
        cast: item.cast,
        country: item.country,
        productCompany: item.productCompany,
        duration: +item.duration,
        imageUrl: {
          imageId: item.imageId,
          url: item.imageUrl,
        },
        videoUrl: {
          videoId: item.videoId,
          url: item.videoUrl,
        },
        createAt: Date.now(),
        listCategoryId: item.listCategoryId.split(','),
        createBy: '6543c28ae4b2dbdf546106c3',
      });
    }),
  );

  await DeleteFile(req.file.path);
});
