// const enums = require('../../../enums');
const { GeneralError } = require('@feathersjs/errors');
const jwt = require('jsonwebtoken');

const handleDelete = async function (params) {
  try {
    /**
     * Find document data
    */
    const {app, req, serviceName, uploadService} = params;
    let docId = req.body._id;
    if (req.params.__feathersId) docId = req.params.__feathersId;
    const isArray = Array.isArray(docId);
    const accessToken = req.headers.authorization;
    const secret = app.get('authentication').secret;
    const user_id = await jwt.verify(accessToken, secret).sub;
    let files = [];
    if (isArray) {
      for (const file of docId) {
        const currentDoc = await app.service(serviceName).get(file);
        if (currentDoc) {
          if (currentDoc.ownerId === user_id) {
            files.push(currentDoc);
          } else {
            throw new GeneralError('Permission denied');
          }
        }
      }
      for (const file of files) {
        await uploadService.remove(file.fileId)
          .catch(error => {
            return new GeneralError(error);
          });
      }
    } else {
      const currentDoc = await app.service(serviceName).get(docId);
      if (currentDoc) {
        if (currentDoc.ownerId === user_id) {
          await uploadService.remove(files.fileId)
            .catch(error => {
              return new GeneralError(error);
            });
        } else {
          throw new GeneralError('Permission denied');
        }
      }
    }
    req.params.query = {_id: docId};
  } catch (error) {
    throw new GeneralError(error);
  }
};

module.exports = handleDelete;
