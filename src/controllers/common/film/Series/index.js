const Series = require('../../../../models/series');

exports.getAllSeries = async (req, res, next) => {
  const series = await Series.find().sort({ createAt: -1 });

  res.status(200).json({
    data: series,
    success: true,
    message: `Get all series successfully.`,
  });
};

exports.getAllSeriesFromPage = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const trash = req.query.trash;
  let count, series;
  if (trash === 'false') {
    count = await Series.find({ isDelete: false }).sort({ createAt: -1 });
    series = await Series.find({ isDelete: false })
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  } else {
    count = await Series.find({ isDelete: true }).sort({ createAt: -1 });
    series = await Series.find({ isDelete: true })
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  res.status(200).json({
    data: series,
    success: true,
    count: count.length,
    message: `Get all series successfully.`,
  });
};
