// const {  UPLOAD_PUBLIC_FILE_KEY, STORAGE_TYPES } = require('../../../enums');
const UPLOAD_PUBLIC_FILE_KEY = Symbol.for('public-file');
const jwt = require('jsonwebtoken');

const uuidv4 = require('uuid/v4');
const getFileUrl = require('./getFileUrl');

const handleUpload = async function (params) {
  const { app, req, uploadService, public, storageService, folderPath } = params;
  const accessToken = req.headers.authorization;
  const secret = app.get('authentication').secret;
  let user_id = '';

  try {
    if (typeof accessToken !== 'undefined') user_id = await jwt.verify(accessToken, secret).sub + '/';
    let files = [];
    for (const file of req.files) {
      const isFile = file && typeof file === 'object';
      const isUrlLink = !isFile && file && typeof file === 'string';

      if (isFile) {
        /**
         * Get file info
         */
        const originalName = file.originalname;
        const awsOriginalName = String(originalName).replace(/ /g, '_');
        const fileId = folderPath + user_id + 'files/' + uuidv4() + '--' + awsOriginalName;

        /**
         * Upload the file to storage
         */
        const upload = await uploadService.create({ fileId, buffer: file, [UPLOAD_PUBLIC_FILE_KEY]: public });


        /**
         * uploadService return the file id in the storage
         */
        if (upload && upload.id) {

          /**
           * get File Url
           * --------------------------------------------------------------------------------
           * get file url will return link to the file in the storage, for example:
           * `${serverUrl}:${app.get('port')}`;
           * `https://s3.amazonaws.com/${app.get('s3').bucket}/${fileId}`;
           * --------------------------------------------------------------------------------
           */
          const fileUrl = getFileUrl({ app, fileId: upload.id, storageService });

          /**
           * Request data
           * --------------------------------------------------------------------------------
           * Add to request data info about the file , this info will be saved on the document in DB
           * --------------------------------------------------------------------------------
           * */
          files.push({fileUrl: fileUrl, fileId: upload.id, fileSize: upload.size, originalName: originalName});
          req.body.file = files;
        } else {
          throw new Error('handleUpload.js failed to upload a file');
        }
      } else if (isUrlLink) {
        console.log('NOT IS FILE');
        /**
         * When request include a file that is a string (this is link to a file and not a real file)
         * then we add to request data storage equal to others
         */
        req.body.storage = 'others' //STORAGE_TYPES.others;
      }
    }

  } catch (error) {
    // app.error('handleUpload.js', error);
    return error;
  }
};

module.exports = handleUpload;
