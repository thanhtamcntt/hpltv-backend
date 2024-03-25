const Series = require('../../../../models/series');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const {
  createImageCloud,
  deleteImageCloud,
} = require('../../../../helpers/uploadImage');

exports.getAllSeries = async (req, res, next) => {
  const series = await Series.find().sort({ createAt: -1 });

  res.status(200).json({
    data: series,
    success: true,
    count: series.length,
    message: `Get all series successfully.`,
  });
};

exports.getSeriesFeature = async (req, res, next) => {
  const series = await Series.find().sort({ createAt: -1 }).limit(10);

  res.status(200).json({
    data: series,
    success: true,
    count: series.length,
    message: `Get series feature successfully.`,
  });
};

exports.postCreateSeries = AsyncHandler(async (req, res, next) => {
  if (!req.files.imageUrl) {
    return next(new ErrorResponse(`Please enter a valid file image`, 404));
  }
  console.log(req.body);
  const infoImage = await createImageCloud(req.files.imageUrl);
  console.log(infoImage);

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

  const series = await Series.deleteOne({ _id: req.params.seriesId });

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

  const infoImage = await createImageCloud(req.files.imageUrl);

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
