// Initializes the `uploads` service on path `/uploads`

const uploadsS3 = require('./uploads-s3.service');

module.exports = function (app) {
  app.configure(uploadsS3);
};
