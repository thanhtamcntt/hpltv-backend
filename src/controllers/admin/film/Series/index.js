const Series = require('../../../../models/series');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const { deleteImageCloud } = require('../../../../helpers/uploadImage');
const csv = require('csvtojson');
const DeleteFile = require('../../../../utils/deleteFile');

exports.postCreateSeries = AsyncHandler(async (req, res, next) => {
  console.log('vôdday');
  if (!req.files['imageUrl']) {
    return next(new ErrorResponse(`Please enter a valid file image`, 404));
  }

  const infoImage = {
    imageId: req.files['imageUrl'][0].filename,
    url: req.files['imageUrl'][0].path,
  };

  const series = await Series.create({
    title: req.body.title,
    releaseDate: req.body.releaseDate,
    description: req.body.description,
    director: req.body.director,
    cast: req.body.cast,
    country: req.body.country,
    imageUrl: infoImage,
    listCategoryId: req.body.listCategoryId.split(','),
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
  console.log(req.body);
  if (!req.params.seriesId) {
    return next(
      new ErrorResponse(`Please enter a valid id series delete`, 404),
    );
  }

  if (!req.body.type) {
    return next(new ErrorResponse(`Please send type series delete`, 404));
  }

  const series = await Series.findById(req.params.seriesId);

  if (!series) {
    return next(
      new ErrorResponse(`Cannot find series id ${req.params.seriesId}!!`, 401),
    );
  }
  if (req.body.type === 'delete') {
    series.isDelete = true;
    await series.save();
  } else {
    await deleteImageCloud(series.imageUrl.imageId);
    await Series.deleteOne({ _id: req.params.seriesId });
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

  const infoImage = {
    imageId: req.files['imageUrl'].filename,
    url: req.files['imageUrl'].path,
  };

  series.title = req.body.title;
  series.releaseDate = req.body.releaseDate;
  series.description = req.body.description;
  series.director = req.body.director;
  series.cast = req.body.cast;
  series.country = req.body.country;
  series.imageUrl = infoImage;
  series.listCategoryId = req.body.listCategoryId.split(',');
  series.updateAt = Date.now();
  await series.save();

  res.status(201).json({
    success: true,
    data: series,
    message: `update series ${req.params.seriesId} successfully`,
  });
});

exports.posAddManySeries = AsyncHandler(async (req, res, next) => {
  const jsonArray = await csv().fromFile(req.file.path);
  console.log(jsonArray);
  count = 0;
  Promise.all(
    jsonArray.map(async (item, id) => {
      console.log(item);
      if (
        item.title === '' ||
        item.description === '' ||
        item.imageUrl === '' ||
        item.listSeriesId === ''
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
      await Series.create({
        title: item.title,
        description: item.description,
        imageUrl: JSON.parse(item.imageUrl),
        listSeriesId:
          item.listSeriesId !== 'none' ? item.listSeriesId.split(',') : [],
        createAt: Date.now(),
        createBy: '6543c28ae4b2dbdf546106c3',
      });
    }),
  );

  console.log('end');
  await DeleteFile(req.file.path);
});

exports.postRecoverSeries = AsyncHandler(async (req, res, next) => {
  const series = await Series.findById(req.body.dataId);

  if (!series) {
    return next(
      new ErrorResponse(`Cannot find series id ${req.body.dataId}!!`, 401),
    );
  }
  series.isDelete = false;
  await series.save();
  res.status(200).json({
    success: true,
    message: 'Changed the status series successfully',
  });
});
