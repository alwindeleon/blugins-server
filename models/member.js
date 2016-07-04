var mongoose = require('mongoose'),
  Task = require('./task'),
  Schema = mongoose.Schema;

var MemberSchema = new Schema({
  name: String,
  username: String,
  password: String,
  tasksDone: [Task]
});


var Member =  mongoose.model('Member', MemberSchema);
module.exports = Member;