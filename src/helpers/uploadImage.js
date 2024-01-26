const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');
const colors = require('colors');
const DeleteFile = require('../utils/deleteFile');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.NAME_CLOUD,
  api_key: process.env.PUBLIC_API_CLOUD,
  api_secret: process.env.SECRET_API_CLOUD,
  secure: true,
});

exports.createImageCloud = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image[0].path, {
      resource_type: 'image',
      public_id: uuidv4(),
      folder: 'image-webFilm',
    });
    await DeleteFile(image[0].filename, 'image');

    return {
      imageId: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.log('error image cloud; ', colors.red(error));
  }
};

exports.createImageAvatar = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image[0].path, {
      resource_type: 'image',
      public_id: uuidv4(),
      folder: 'image-avatar',
    });
    await DeleteFile(image[0].filename, 'image');

    return {
      imageId: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.log('error image cloud; ', colors.red(error));
  }
};

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
