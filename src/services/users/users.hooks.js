const { authenticate } = require('@feathersjs/authentication').hooks;
const {GeneralError} = require('@feathersjs/errors');
const Joi = require('@hapi/joi');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{6,30}$/).required(),
  strategy: Joi.string().valid('local').required()
});

async function validate(context) {
  const data = context.arguments[0];
  try {
    await userSchema.validateAsync(data);
  }
  catch (err) {
    throw new GeneralError(err);
  }
  return context;
}

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [
      validate,
      hashPassword('password')
    ],
    update: [ hashPassword('password'),  authenticate('jwt') ],
    patch: [ hashPassword('password'),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
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
