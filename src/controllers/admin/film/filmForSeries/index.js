const Series = require('../../../../models/series');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const { deleteImageCloud } = require('../../../../helpers/uploadImage');
const csv = require('csvtojson');
const DeleteFile = require('../../../../utils/deleteFile');

exports.getAllFilmForSeries = AsyncHandler(async (req, res, next) => {
  console.log(req.params.seriesId);
});
