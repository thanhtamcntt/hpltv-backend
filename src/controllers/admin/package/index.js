const Package = require('../../../models/package');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.postCreatePackage = AsyncHandler(async (req, res, next) => {
  console.log('body created', req.body);
  const package = await Package.create({
    typePack: req.body.typePack,
    monthlyPrice: +req.body.monthlyPrice,
    qualityPicture: req.body.qualityPicture,
    resolution: req.body.resolution,
    deviceSupport: req.body.deviceSupport,
    quantityWatch: +req.body.quantityWatch,
    quantityDownload: +req.body.quantityDownload,
    createAt: Date.now(),
  });
  if (!package) {
    return next(
      new ErrorResponse(
        `The system is experiencing problems, please try again later!!`,
        401,
      ),
    );
  }
  res.status(201).json({
    success: true,
    data: package,
    message: 'Create package successfully',
  });
});

exports.postUpdatePackage = AsyncHandler(async (req, res, next) => {
  console.log('body created', req.body);
  console.log('body created', req.params);
  const package = await Package.findById(req.params.packageId);

  if (!package) {
    return next(
      new ErrorResponse(
        `Cannot find package id ${req.params.packageId}!!`,
        401,
      ),
    );
  }
  (package.typePack = req.body.typePack),
    (package.qualityPicture = req.body.qualityPicture),
    (package.resolution = req.body.resolution),
    (package.deviceSupport = req.body.deviceSupport),
    (package.quantityWatch = +req.body.quantityWatch),
    (package.quantityDownload = +req.body.quantityDownload);
  await package.save();
  res.status(201).json({
    success: true,
    data: package,
    message: 'Update package successfully',
  });
});

// exports.postCreate = AsyncHandler(async (req, res, next) => {
//   const paymentData = await JSON.parse(
//     fs.readFileSync(path.join(__dirname, '../../../assets/payment.json')),
//   );
//   console.log(paymentData);
//   for (let i = 0; i < paymentData.length; i++) {
//     const package = await Package.create({
//       typePack: paymentData[i].typePack,
//       monthlyPrice: +paymentData[i].monthlyPrice,
//       qualityPicture: paymentData[i].qualityPicture,
//       resolution: paymentData[i].resolution,
//       deviceSupport: paymentData[i].deviceSupport,
//       quantityWatch: +paymentData[i].quantityWatch,
//       quantityDownload: +paymentData[i].quantityDownload,
//       createAt: Date.now(),
//     });
//   }

//   // res.status(201).json({
//   //   success: true,
//   //   data: package,
//   //   message: 'Create package successfully',
//   // });
// });
