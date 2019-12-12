const {GeneralError} = require('@feathersjs/errors');

/**
 * @function getFileUrl
 * Build full url by the storage type,
 * when the storage is local we use get-file without serverUrl, in this way we can support the DB even if server url is changed
 * @param {object} payload
 * @param {object} payload.app
 * @param {string} payload.storageService // storageService name, oneOf: ['local-private','local-public','s3','google-cloud']
 * @param {string} payload.fileId // file id in storage service
 */
const getFileUrl = function (payload) {
  try {
    const {
      app,
      storageService,
      fileId
    } = payload;
    let fileUrl;
    if (storageService === 's3') {
      fileUrl = `https://s3.amazonaws.com/${app.get('s3').bucket}/${fileId}`;
    }
    return fileUrl;
  } catch (error) {
    payload.app.error('feathers-mongoose-casl - feathers-mongoose-casl/src/utils/uploadMiddleware/utils/getFileUrl.js', error);
    throw new GeneralError();
  }

};

module.exports = getFileUrl;
