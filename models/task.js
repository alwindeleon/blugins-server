var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TaskSchema = new Schema({
  typeOfActivity: String,
  timeToFinish: Number,
  volume: Number
});


var Task = mongoose.model('Task', TaskSchema);

module.exports = Task;