// const { UPLOAD_SERVICES } = require('../../enums');
const getFileFromRequest = require('./utils/getFileFromRequest');
const {GeneralError, BadRequest} = require('@feathersjs/errors');

const getMulter = require('./utils/getMulter');

const handleDelete = require('./utils/handleDelete');
const handleUpload = require('./utils/handleUpload');

const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const accessSchema = Joi.object({
  access: Joi.string().valid('public', 'private').required()
});

const idSchema = Joi.object({
  _id: Joi.objectId().required()
});

/**
 * @function uploadMiddleware
 * @description  * This middleware is used by any service that want to upload a file to storage
 * the upload done by the one of the upload services base of the storageService
 * storageService can be one of: ['local_private','local_public','s3','google-cloud']
 * and the upload will be done with one of the upload services:
 * [app.service('upload-local-private')]
 * [app.service('upload-local-public')]
 * [app.service('uploads-s3')]
 * [app.service('uploads-google')]
 *
 * @param {object}  config
 * @param {object}  config.app                  The feathers app
 * @param {string}  [config.fileKeyName='file'] The field name of the file, default is 'file'
 * @param {string}  config.serviceName          The service name
 * @param {string}  config.storageService       oneOf: ['local-private','local-public','s3','google-cloud']
 * @param {boolean} config.public            set true if you want the file to be public
 * @param {array}   [config.mimetypes]          pass array with mimetypes to filter what files your want to allow
 *
 */
const uploadMiddleware = function (config) {
  const {
    app,
    fileKeyName = 'file',
    serviceName,
    storageService,
    public = false,
    mimetypes,
    folderPath
  } = config;

  const multipartMiddleware = getMulter(mimetypes);


  return async function (req, res, next) {
    /**
     * Define the upload service
     */
    const uploadServiceName = 'uploads-s3'; //UPLOAD_SERVICES[storageService];
    const uploadService = app.service(uploadServiceName);
    if (req.method === 'GET') {
      /**
       * GET request
       * --------------------------------------------------------------------------------
       * uploadMiddleware is not relevant when client GET document from DB
       * --------------------------------------------------------------------------------
       */
      return next();
    } else if (req.method === 'DELETE') {

      /**
      *
      * DELETE
      * --------------------------------------------------------------------------------
      * When service get delete request,
      * this middleware will delete the file from the storage
      * before deleting the document from the DB
      * --------------------------------------------------------------------------------
      *
      */

      try {
        await getFileFromRequest(multipartMiddleware, req, res, fileKeyName);
        const id = req.body;
        if (Array.isArray(id._id)) {
          for (const doc of id._id) {
            await idSchema.validateAsync({_id: doc});
          }
        } else {
          await idSchema.validateAsync(id);
        }
      } catch (error) {
        if (error.message.includes('Accept')) {
          return next(new BadRequest(error.message));
        } else {
          if (error.message.includes('_id')) {
            return next(new GeneralError(error));
          } else {
            return next(new GeneralError('File type is not acceptable'));
          }
        }
      }

      try {
        await handleDelete({ app, req, serviceName, uploadService })
      } catch (error) {
        return next(new GeneralError(error));
      }
      return next();
    } else {
      /**
     * get File From Request
     * --------------------------------------------------------------------------------
     * This function will add the file inside [req[fileKeyName]] with multer
     * --------------------------------------------------------------------------------
     *
     */
      try {
        await getFileFromRequest(multipartMiddleware, req, res, fileKeyName);
        await accessSchema.validateAsync(req.body);
      } catch (error) {
        if(error.message.includes('Accept')){
          return next(new BadRequest(error.message));
        }else {
          if (error.message.includes('access')) {
            return next(new GeneralError(error));
          } else {
            return next(new GeneralError('upload failed'));
          }
        }
      }

      try {
        await handleUpload({ app, req, uploadService, public, storageService, folderPath });
      } catch (error) {
        return next(new GeneralError('upload failed'));
      }
      return next();
    }
  };

};

module.exports = uploadMiddleware;
