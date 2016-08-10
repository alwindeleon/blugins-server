var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ClientSchema = new Schema({
  name: String,
  cmid: String,
  notes: String,

});


var Client =  mongoose.model('Member', ClientSchema);
module.exports = Client;