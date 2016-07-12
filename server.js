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
var xlsxj = require("xlsx-to-json");
var fileUpload = require('express-fileupload');


app.use(cookieParser('55555'));
app.use(expressSession({secret:'55555'}));
app.use(fileUpload());
mongoose.connect(dbpath);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + dbpath);
});//

// helper functions
function getClient(query, clients){

  for( var i = 0; i < clients.length; i++){
    if(clients[i].CMID == query || (typeof query == "string" && isSubstring(clients[i].CMID, query))){
      return clients[i];
    }
    if(isSubstring(clients[i].COMPANY.toLowerCase(),query.toLowerCase()) || clients[i].COMPANY.toLowerCase() == query.toLowerCase() ){
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


var sheets = ["Queue","ASIA","AMERS","EMEA"];

for( var i = 0; i < sheets.length ; i++){
  xlsxj({
    input: "SPP_NOTES.xlsx", 
    output: null,
    sheet: sheets[i]
  }, function(err, result) {
    if(err) {
      console.error(err);
    }else {
      
      clients = clients.concat(result);
    }
  });
}




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


// NOTES PLUGIN ENDPOINTS
app.get('/clients/:query',function(req, res){
    var currentClient = getClient(req.params.query, clients);
    if(currentClient != null){
      return res.jsonp(currentClient);
    }
    else{
      return res.jsonp({message:"no matches"});
    }
});

app.get('/upload',function(req, res, next){
  return res.render('upload');
});
 
app.post('/upload', function(req, res) {
	var sampleFile;
 
	if (!req.files) {
		res.send('No files were uploaded.');
		return;
	}
  clients = []
	sampleFile = req.files.sampleFile;
	sampleFile.mv('./SPP_NOTES.xlsx', function(err) {
		if (err) {
			res.status(500).send(err);
		}
		else {
		  for( var i = 0; i < sheets.length ; i++){
        xlsxj({
          input: "SPP_NOTES.xlsx", 
          output: null,
          sheet: sheets[i]
        }, function(err, result) {
          if(err) {
            console.error(err);
          }else {
            console.log(result);
            clients = clients.concat(result);
          }
        });
      }
  
			return res.send('File uploaded!');
		}
	});
});


// TASK TRACKER ENDPOINTS
app.get('/', function(req, res) {
    // res.json(storage.items);
    return res.render('login');
});

app.post('/login',function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  
  Member.findOne({username:username,password:password}, function(err, user){
      if(err) return res.send(err);
      if(user == null){
        return res.jsonp({status:false});
      }
      return res.jsonp({username:user.username,name:user.name,status:true});
  });
});




app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("running");
});