const { authenticate } = require('@feathersjs/authentication').hooks;
const dauria = require('dauria');
const { GeneralError } = require('@feathersjs/errors');
const { disallow } = require('feathers-hooks-common');
const UPLOAD_PUBLIC_FILE_KEY = 'public-file';

module.exports = {
  before: {
    all: [disallow('external')],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      function (context) {
        context.params.s3 = { ACL: 'authenticated-read' };

        if (context.data.buffer) {
          const uri = dauria.getBase64DataURI(context.data.buffer.buffer, context.data.buffer.mimetype);
          context.data = {
            uri: uri,
            mimetype: context.data.buffer.mimetype,
            id: context.data.fileId
          };
        } else if (!context.data.uri && context.params.file) {
          const file = context.params.file;
          const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
          context.data = {
            uri: uri,
            mimetype: file.mimetype,
            id: context.data.fileId
          };
        } else if (!context.data.uri && !context.params.file) {
          throw new GeneralError('URI or FILE object is required');
        }
      }
    ],
    update: [],
    patch: [],
    remove: [
      authenticate('jwt')
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
