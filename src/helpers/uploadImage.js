const cloudinary = require('../configs/cloudinary');
const colors = require('colors')

exports.deleteImageCloud = async (id) => {
  try {
    const results = await cloudinary.api.delete_resources(
      [id],
      { type: 'upload', resource_type: 'image' },
      (result, error) => {
        console.log(colors.green(result));
      },
    );

    console.log(colors.yellow(results));
  } catch (error) {
    console.log('error delete image'.red, colors.red(error));
  }
};
