
/**
   * @function getFileFromRequest
   * Use multer as async/await inside express middleware
   * @param {*} req
   * @param {*} res
   * @param {*} fileKeyName
   */
const getFileFromRequest = async function (multipartMiddleware, req, res, fileKeyName) {

  const result = await new Promise((resolve, reject) => {
    multipartMiddleware.array(fileKeyName)(req, res, (err) => {
      if(!err) resolve(err);
      else reject(err);
    });
  });
  if(result instanceof Error){
    throw new Error(result.message);
  }
  return result;
};

module.exports = getFileFromRequest;
