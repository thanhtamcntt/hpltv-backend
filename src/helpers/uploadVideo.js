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

exports.createVideoCloud = async (video) => {
  try {
    const result = await cloudinary.uploader.upload(video[0].path, {
      resource_type: 'video',
      public_id: uuidv4(),
      folder: 'video-webFilm',
    });
    await DeleteFile(video[0].filename, 'video');
    const duration = result.duration % 60;
    let resultDuration;
    if (duration < 5) {
      resultDuration = Math.floor(result.duration / 60);
    } else {
      resultDuration = Math.ceil(result.duration / 60);
    }
    return {
      videoUrl: { videoId: result.public_id, url: result.secure_url },
      duration: resultDuration,
    };
  } catch (error) {
    console.log(colors.red(error));
  }
};

exports.deleteVideoCloud = async (id) => {
  try {
    const results = await cloudinary.api.delete_resources(
      [id],
      { type: 'upload', resource_type: 'video' },
      (result, error) => {
        console.log(colors.green(result));
      },
    );

    console.log(colors.yellow(results));
  } catch (error) {
    console.log('error delete video'.red, colors.red(error));
  }
};
