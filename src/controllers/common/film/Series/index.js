const Series = require('../../../../models/series');


exports.getAllSeries = async (req, res, next) => {
  const series = await Series.find().sort({ createAt: -1 });

  res.status(200).json({
    data: series,
    success: true,
    count: series.length,
    message: `Get all series successfully.`,
  });
};
