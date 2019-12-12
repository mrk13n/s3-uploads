// Initializes the `userFiles` service on path `/user-files`
const createService = require('feathers-mongoose');
const createModel = require('../../models/user-files.model');
const uploadMiddleware = require('../../middleware/uploadMiddleware');
const hooks = require('../../hooks/files.hooks');
const doc = require('./user-files.doc');

module.exports = function (app) {
  const Model = createModel(app);

  const options = {
    Model,
    multi: true
  };

  const userService = doc(createService(options));

  // Initialize our service with any options it requires
  app.use('/user-files',
    uploadMiddleware({
      app,
      fileKeyName: 'file',
      serviceName: 'user-files',
      storageService: 's3',
      folderPath: 'users/', // always ends with slash!
      public: true,
      mimetypes: ['image/png','image/jpeg'] //only png and jpeg
    }),
    function (req, res, next) {
      if (typeof req.body.file !== 'undefined') {
        if (Array.isArray(req.body.file)) {
          req.body.file.forEach(file => {
            file.access = req.body.access;
          });
        }
        req.body = req.body.file;
      }
      next();
    },
    userService
  );

  // Get our initialized service so that we can register hooks
  const service = app.service('user-files');

  service.hooks(hooks);
};
