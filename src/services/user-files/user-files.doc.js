const m2s = require('mongoose-to-swagger');

module.exports = function (service) {

  service.docs = {
    description: 'User files service',
    operations: {
      find: {
        summary: 'Find files',
        description: 'Find user files, public and private.',
        parameters: [],
        responses: {
          200: {
            description: 'Success',
            schema: {
              $ref: '#/definitions/user-files_list'
            }
          },
          500: {
            description: 'General error'
          }
        },
        security: [
          {
            bearer: []
          }
        ]
      },
      get: {
        summary: 'Find file by ID',
        description: 'Find user file by ID, public or private.',
        parameters: [
          {
            description: 'File ID',
            in: 'path',
            required: true,
            name: '_id',
            type: 'string'
          }
        ],
        responses: {
          200: {
            description: 'Success',
            schema: {
              $ref: '#/definitions/user-files'
            }
          },
          404: {
            description: 'Not found',
          },
          500: {
            description: 'General error'
          }
        },
        security: [
          {
            bearer: []
          }
        ]
      },
      create: {
        summary: 'Load files',
        description: 'Load your own files. (Swagger does not supported multiple upload, but api have multiple upload with key `file`)',
        parameters: [
          {
            in: 'formData',
            name: 'file',
            type: 'file',
            required: true,
            description: 'Only png or jpg file'
          },
          {
            in: 'formData',
            name: 'access',
            type: 'string',
            required: true,
            description: 'File access private or public'
          }
        ],
        responses: {
          201: {
            description: 'Created',
            schema: {
              $ref: '#/definitions/userFiles_list'
            }
          },
          401: {
            description: 'Not authenticated'
          },
          500: {
            description: 'General error'
          }
        },
        security: [
          {
            bearer: []
          }
        ],
        consumes: ['multipart/form-data']
      },
      update: {
        summary: 'Method not allowed!',
        description: 'Method not allowed!',
        parameters: [],
        responses: {}
      },
      patch: {
        summary: 'Method not allowed!',
        description: 'Method not allowed!',
        parameters: [],
        responses: {}
      },
      remove: {
        summary: 'Remove file by ID',
        description: 'Remove your own file by ID',
        parameters: [
          {
            description: 'File ID',
            in: 'path',
            required: true,
            name: '_id',
            type: 'string'
          }
        ],
        responses: {
          200: {
            description: 'Success',
            schema: {
              $ref: '#/definitions/userFiles_list'
            }
          },
          401: {
            description: 'Not authenticated'
          },
          404: {
            description: 'Not found'
          },
          500: {
            description: 'General error'
          }
        },
        security: [
          {
            bearer: []
          }
        ],
        consumes: ['multipart/form-data']
      },
    },
    definitions: {
      userFiles: m2s(service.options.Model),
      'user-files': {
        type: 'object',
        required: [
          'id',
          'signedUrl'
        ],
        properties: {
          id: {
            type: 'string',
            description: 'File ID'
          },
          signedUrl: {
            type: 'string',
            description: 'File URL'
          }
        }
      },
      'user-files_list': {
        type: 'array',
        items: { $ref: '#/definitions/user-files' }
      },
      'userFiles_list':{
        type: 'array',
        items: {$ref: '#/definitions/userFiles'}
      }
    },
  };

  return service;
};
