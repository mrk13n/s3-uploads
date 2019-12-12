const { authenticate } = require('@feathersjs/authentication').hooks;
const hooks = require('feathers-authentication-hooks');
const { disallow } = require('feathers-hooks-common');
const uploadsHooks = require('./uploads/uploadsHooks');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

async function signFileUrlHook(context) {
  if (typeof context.params.route === 'undefined') return context;
  const secret = context.app.get('authentication').secret;
  let urls = [];
  let authenticated;
  if (typeof context.params.headers.authorization === 'undefined') {
    authenticated = false;
  } else {
    // checkAuthorization
    try {
      jwt.verify(context.params.headers.authorization, secret);
      authenticated = true;
    }
    catch (e) {
      authenticated = false;
    }

  }

  const s3 = new AWS.S3({
    accessKeyId: context.app.get('s3').accessKeyId,
    secretAccessKey: context.app.get('s3').secretAccessKey
  });

  if (Array.isArray(context.result)) {
    context.result.forEach(document => {
      document.signedUrl = s3.getSignedUrl('getObject', {
        Bucket: context.app.get('s3').bucket,
        Key: document.fileId,
        Expires: context.app.get('s3').signedUrlExpires
      });
      if ((!authenticated && document.access === 'public') || authenticated) {
        urls.push({ id: document._id, signedUrl: document.signedUrl });
      }
    });
    context.result = urls;
  } else {
    if ((!authenticated && context.result.access === 'public') || authenticated) {
      context.result.signedUrl = s3.getSignedUrl('getObject', {
        Bucket: context.app.get('s3').bucket,
        Key: context.result.fileId,
        Expires: context.app.get('s3').signedUrlExpires
      });
      urls = {id: context.result._id, signedUrl: context.result.signedUrl};
      context.result = urls;
    } else {
      context.result = {
        message: 'File is private'
      };
    }
  }
}

const uploadHookConfig = {
  fileKeyName: 'file',
  userKeyName: 'user',
  public: true,
  singUrlKeyName: 'file'
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      uploadsHooks(uploadHookConfig),
      hooks.associateCurrentUser({ idField: '_id', as: 'ownerId' }),
    ],
    update: [disallow('external')],
    patch: [disallow('external')],
    remove: [
      authenticate('jwt'),
      uploadsHooks(uploadHookConfig)
    ]
  },

  after: {
    all: [
      uploadsHooks(uploadHookConfig)
    ],
    find: [
      signFileUrlHook
    ],
    get: [
      signFileUrlHook
    ],
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
