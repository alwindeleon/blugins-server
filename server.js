var express = require('express');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var path = require("path");
var app = express();
var fs = require('fs');
var mongoose = require('mongoose');
var dbpath =  process.env.MONGODB_URI || 'mongodb://localhost/workflow-development';
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var Member = require('./models/member');
var Task = require('./models/task');


app.use(cookieParser('55555'));
app.use(expressSession({secret:'55555'}));

mongoose.connect(dbpath);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + dbpath);
});//

// helper functions
function getClient(query, clients){
  console.log(query);
  for( var i = 0; i < clients.length; i++){
    if(clients[i].cmid == query || (typeof query == "string" && isSubstring(clients[i].cmid, query))){
      return clients[i];
    }
    console.log(clients[i]);
    if(isSubstring(clients[i].company,query) || clients[i].company == query ){
      return clients[i];
    }
  }
  return null;
}

function isSubstring(mstr, substr){
  return mstr.indexOf(substr) > -1;
}

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

var authorize = function(req, res, next){
  if(req.session && req.session.user){
    next();
  } else {
    return res.send(401);
  }

};
// then do  req.session.user =user;
// req.session.admin = true;


// load data
/* global clients */
clients = [];

fs.readFile('data.csv', 'utf8', function (err,data) {
  console.log(data);
  if (err) {
    return console.log(err);
  }
  data = data.split(',|');
  for( var i = 0; i < data.length; i++){
    data[i] = data[i].split(',');
    if(data[i][1] == undefined) break;
    clients.push({
      cmid:data[i][0].trim(),
      company: data[i][1].trim(),
      urgency: data[i][3].trim(),
      comments: data[i][4].trim(),
      region: data[i][2].trim()
    });
  }
});

// for plugins ajax requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('client'));

app.set("view engine", 'jade');
app.set("views", path.join(__dirname,"views"));
app.use(express.static('./client'));

app.get('/clients/:query',function(req, res){
    var currentClient = getClient(req.params.query, clients);
    if(currentClient != null){
      return res.jsonp(currentClient);
    }
    else{
      return res.jsonp({message:"no matches"});
    }
});

app.delete('/items/:id',function(req,res){
// 	return res.json(storage.remove(id)[0]);
});

app.get('/', function(req, res) {
    // res.json(storage.items);
    return res.render('login');
});

app.post('/items', jsonParser, function(req, res) {

    // res.status(201).json(item);
});

app.put('/items/:id',jsonParser,function(req,res){

// 	return storage.items[parseInt(req.body.id)];
});



app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("running");
});
