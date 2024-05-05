const Series = require('../../../../models/series');

exports.getAllSeries = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const count = await Series.find().sort({ createAt: -1 });
  const series = await Series.find()
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    data: series,
    success: true,
    count: count.length,
    message: `Get all series successfully.`,
  });
};
