const swagger = require('feathers-swagger');

module.exports = swagger({
  docsPath: '/docs',
  uiIndex: true,
  specs: {
    info: {
      title: 'Documentation',
      description: 'Documentation of services',
      version: '1.0.0'
    },
    paths: {
      '/user-files': {
        get: {},
        post: {},
        delete: {
          summary: 'Remove files',
          description: 'Remove your own files. (Swagger does not supported multiple upload, but api have multiple upload with key `_id`).',
          parameters: [
            {
              in: 'formData',
              name: '_id',
              type: 'string',
              required: true,
              description: 'ID files to delete'
            },
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
          tags: ['user-files'],
          consumes: ['multipart/form-data'],
        }
      },
    },
    securityDefinitions: {
      bearer: {
        type: 'apiKey',
        name: 'authorization',
        in: 'header'
      }
    },
    security: [
      {
        bearer: []
      }
    ]
  },
  ignore: {
    tags: ['authentication', 'users', 'uploads-s3']
  }
});
