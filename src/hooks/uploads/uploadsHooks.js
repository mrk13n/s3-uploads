const { set } = require('lodash');

module.exports = function (config) {

  const {
    fileKeyName = 'file',
    userKeyName= 'user',
    public,
    singUrlKeyName= 'file'
  } = config;

  return async function (hook) {
    const { type, method } = hook;

    if(type === 'before' && ['create','patch','update'].includes(method)){
      const isArray = Array.isArray(hook.data);
      if(isArray){
        hook.data = hook.data.map(doc => {
          doc[userKeyName] = hook.params.user._id;
          return doc;
        });
      }else{
        hook.data[userKeyName] = hook.params.user._id;
      }

      return hook;
    }
    if (type === 'before' && ['remove'].includes(method)) {
      const id = hook.params.route.query._id;
      if (Array.isArray(id)) {
        set(hook.params, 'query._id', hook.params.route.query._id);
      } else {
        hook.id = id;
      }
      return hook;
    }
    return hook;
  };
};
