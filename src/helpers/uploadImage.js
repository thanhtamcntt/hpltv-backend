const cloudinary = require('cloudinary');
const colors = require('colors');

exports.deleteImageCloud = async (id) => {
  try {
    const results = await cloudinary.api.delete_resources(
      [id],
      { type: 'upload', resource_type: 'image' },
      (result, error) => {},
    );
  } catch (error) {
    console.log('error delete image'.red, colors.red(error));
  }
};
