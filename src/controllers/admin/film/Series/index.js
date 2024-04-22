const Series = require('../../../../models/series');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const {
  deleteImageCloud,
} = require('../../../../helpers/uploadImage');



exports.postCreateSeries = AsyncHandler(async (req, res, next) => {
  if (!req.files['imageUrl']) {
    return next(new ErrorResponse(`Please enter a valid file image`, 404));
  }


  const infoImage = {imageId: req.files['imageUrl'][0].filename, url: req.files['imageUrl'][0].path}


  const series = await Series.create({
    title: req.body.title,
    description: req.body.description,
    imageUrl: infoImage,
    listSeriesId:
      req.body.listSeriesId !== 'none' ? req.body.listSeriesId.split(',') : [],
    createAt: Date.now(),
    createBy: '6543c28ae4b2dbdf546106c3',
  });
  console.log('new serries', series);

  if (!series) {
    return next(
      new ErrorResponse(
        `The system is experiencing problems, please try again later!!`,
        401,
      ),
    );
  }

  res.status(201).json({
    success: true,
    data: series,
    message: 'Create series successfully',
  });
});

exports.postDeleteSeries = AsyncHandler(async (req, res, next) => {
  console.log(req.params);
  if (!req.params.seriesId) {
    return next(
      new ErrorResponse(`Please enter a valid id series delete`, 404),
    );
  }

  const series = await Series.findOne({ _id: req.params.seriesId });

  if (!series) {
    return next(
      new ErrorResponse(
        `The system is experiencing problems, please try again later!!`,
        401,
      ),
    );
  }
  await deleteImageCloud(series.imageUrl.imageId);

  await Series.deleteOne({ _id: req.params.seriesId });

  res.status(201).json({
    success: true,
    message: `delete series ${req.params.seriesId} successfully`,
  });
});

exports.postUpdateSeries = AsyncHandler(async (req, res, next) => {
  const series = await Series.findById(req.params.seriesId);

  if (!series) {
    return next(
      new ErrorResponse(`Cannot find series id ${req.params.seriesId}!!`, 401),
    );
  }

  await deleteImageCloud(series.imageUrl.imageId);

  const infoImage = {imageId: req.files['imageUrl'].filename, url: req.files['imageUrl'].path}

  series.title = req.body.title;
  series.description = req.body.description;
  series.imageUrl = infoImage;
  series.listSeriesId =
    req.body.listSeriesId !== 'none' ? req.body.listSeriesId.split(',') : [];
  series.updateAt = Date.now();
  await series.save();

  res.status(201).json({
    success: true,
    data: series,
    message: `update series ${req.params.seriesId} successfully`,
  });
});
