var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MemberSchema = new Schema({
  name: String,
  username: String,
  password: String,
  tasksDone: [
      {
        subject: String,
        typeOfActivity: Number,
        timeToFinish: Number,
        volume: Number,
        date: Date
      }
    ]
});


var Member =  mongoose.model('Member', MemberSchema);
module.exports = Member;