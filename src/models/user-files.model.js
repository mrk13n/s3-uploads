// userFiles-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const userFiles = new Schema({
    _id: {type: Schema.ObjectId, auto: true, required: true },
    fileUrl: { type: String, required: true },
    fileId: { type: String, required: true },
    fileSize: { type: Number, required: true },
    originalName: { type: String, required: true },
    ownerId: { type: String , required: true },
    access: {type: String, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('userFiles', userFiles);
};
