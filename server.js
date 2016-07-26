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
var xlsxj = require("xlsx-to-json");
var fileUpload = require('express-fileupload');


app.use(cookieParser('55555'));
app.use(expressSession({secret:'55555'}));
app.use(fileUpload());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static('/client'));
app.set("view engine", 'jade');
app.set("views", path.join(__dirname,"views"));
app.use(express.static(__dirname+"/client"));

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

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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
//type of tasks -
var typeOfActivity = ["Website Update", "Fulfillment Client Email", "Client Call","Corporate Governance Hotline","Fulfillment SR Query","Request Cancel Quote","Billing Issue Investigation"];
var timeItTook = [60,30,15,30,60,60,60];
app.get('/', function(req, res) {
    // res.json(storage.items);
    
    
    return res.render('login');
});

app.get('/dashboard', function(req, res) {
    var d = new Date();
    return res.render('dashboard',{month:monthNames[d.getMonth()], year: d.getFullYear()});
});

app.post('/login',jsonParser,function(req, res){
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  console.log("IN");
  Member.findOne({username:username,password:password}, function(err, user){
      if(err) {
        console.log("IN1")
        return res.jsonp({status:false});
      }
      if(user == null){
        console.log("IN2");
        return res.jsonp({status:false});
      }
      console.log("IN3");
      return res.jsonp({username:user.username,name:user.name,status:true});
  });
});

app.post('/tasks/record',jsonParser,function(req, res){
  console.log(req.body);
  console.log(req.body.subject);
  console.log(req.body.type);
  console.log("IN");
  Member.findOne({username:req.body.username}, function(err, user){
      user.tasksDone.push({
        subject:req.body.subject,
        volume:req.body.volume,
        type: req.body.type,
        date: new Date()
      });
      user.save(function(err){
         if(err) {
          console.log("IN1")
          return res.jsonp({success:false});
        }
        if(user == null){
          console.log("IN2");
          return res.jsonp({success:false});
        }
        console.log("IN3");
        return res.jsonp({success:true});
        })
  });
});

app.get('/dashboard/:day', function(req, res, next) {
    function add(a, b){
      return a+b;
    }
    var numTasksPerHour = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var ron = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var jc = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var joen = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var blu = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var jcType =[0,0,0,0,0,0,0];
    var ronType = [0,0,0,0,0,0,0];
    var joenType = [0,0,0,0,0,0,0];
    var tasks = [];
    Member.find({},function(err, users){
      if(err) console.log(err);
      for(var i = 0 ; i < users.length; i++){
        tasks = tasks.concat(users[i].tasksDone);
      }
      var dateToday = new Date();
      for(var i = 0; i < tasks.length; i++){

        if( tasks[i].date.getMonth() == dateToday.getMonth() && tasks[i].date.getDate() == req.params.day){
          console.log(tasks[i].date)
          console.log("IN");
          numTasksPerHour[tasks[i].date.getHours()-1]++;
        }
      }
      for(var i = 0; i < users.length ; i++ ){
        if(users[i].username == "johncarlo"){
          for(var j = 0; j < users[i].tasksDone.length ; j++){
            if( users[i].tasksDone[j].date.getMonth() == dateToday.getMonth() && users[i].tasksDone[j].date.getDate() == req.params.day){
              var hour =  users[i].tasksDone[j].date.getHours()-1;
              jc[hour]++;
              jcType[users[i].tasksDone[j].typeOfActivity]++;
            }
            
          }
        }else  if(users[i].username == "jo-en"){
          for(var j = 0; j < users[i].tasksDone.length ; j++){
            if( users[i].tasksDone[j].date.getMonth() == dateToday.getMonth() && users[i].tasksDone[j].date.getDate() == req.params.day){
              var hour =  users[i].tasksDone[j].date.getHours()-1;
              joen[hour]++;
              joenType[users[i].tasksDone[j].typeOfActivity]++;
            }
            
          }
        }else  if(users[i].username == "ronryan"){
          for(var j = 0; j < users[i].tasksDone.length ; j++){
            if( users[i].tasksDone[j].date.getMonth() == dateToday.getMonth() && users[i].tasksDone[j].date.getDate() == req.params.day){
              var hour =  users[i].tasksDone[j].date.getHours()-1;
              ron[hour]++;
              ronType[users[i].tasksDone[j].typeOfActivity]++;
            }
            
          }
        }
      }
      var month = dateToday.getMonth();
      return res.render('dashboard_day',{status:true,month:month,ronType: ronType, jcType:jcType, joenType:joenType,numTasksPerHour: numTasksPerHour,ron: ron, joen:joen, jc:jc,blu:blu,ronTotal: ron.reduce(add), joenTotal: joen.reduce(add),jcTotal: jc.reduce(add),bluTotal:0});
     });
    
  
});

app.get('/dashboard/month/:month',function(req, res){
  function add(a, b){
      return a+b;
    }
    var numTasksPerHour = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var ron = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var jc = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var joen = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var blu = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var jcType =[0,0,0,0,0,0,0];
    var ronType = [0,0,0,0,0,0,0];
    var joenType = [0,0,0,0,0,0,0];
    var tasks = [];
    var dateToday = new Date();
    Member.find({},function(err, users){
      if(err) console.log(err);
      for(var i = 0 ; i < users.length; i++){
        tasks = tasks.concat(users[i].tasksDone);
      }
      var dateToday = new Date();
      for(var i = 0; i < tasks.length; i++){

        if( tasks[i].date.getMonth() == req.params.month ){
          console.log(tasks[i].date)
          console.log("IN");
          numTasksPerHour[tasks[i].date.getHours()-1]++;
        }
      }
      for(var i = 0; i < users.length ; i++ ){
        if(users[i].username == "johncarlo"){
          for(var j = 0; j < users[i].tasksDone.length ; j++){
            if( users[i].tasksDone[j].date.getMonth() == req.params.month){
              var hour =  users[i].tasksDone[j].date.getHours()-1;
              jc[hour]++;
              jcType[users[i].tasksDone[j].typeOfActivity]++;
            }
            
          }
        }else  if(users[i].username == "jo-en"){
          for(var j = 0; j < users[i].tasksDone.length ; j++){
            if(  users[i].tasksDone[j].date.getMonth() == req.params.month ){
              var hour =  users[i].tasksDone[j].date.getHours()-1;
              joen[hour]++;
              joenType[users[i].tasksDone[j].typeOfActivity]++;
            }
            
          }
        }else  if(users[i].username == "ronryan"){
          for(var j = 0; j < users[i].tasksDone.length ; j++){
            if(  users[i].tasksDone[j].date.getMonth() == req.params.month){
              var hour =  users[i].tasksDone[j].date.getHours()-1;
              ron[hour]++;
              ronType[users[i].tasksDone[j].typeOfActivity]++;
            }
            
          }
        }
      }
    
      return res.render('dashboard_day',{status:false,ronType: ronType, jcType:jcType, joenType:joenType,numTasksPerHour: numTasksPerHour,ron: ron, joen:joen, jc:jc,blu:blu,ronTotal: ron.reduce(add), joenTotal: joen.reduce(add),jcTotal: jc.reduce(add),bluTotal:0});
     });
});

app.get('/dashboard/range/:range',function(req, res){
  var range = req.params.range.split('-')
  var from = range[0];
  var to = range[1];
  
  function isInRange(from,to,num){
    return num == from || num == to || (from < num && to > num);
  }
  function add(a, b){
      return a+b;
    }
    var numTasksPerHour = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var ron = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var jc = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var joen = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var blu = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var jcType =[0,0,0,0,0,0,0];
    var ronType = [0,0,0,0,0,0,0];
    var joenType = [0,0,0,0,0,0,0];
    var tasks = [];
    Member.find({},function(err, users){
      if(err) console.log(err);
      for(var i = 0 ; i < users.length; i++){
        tasks = tasks.concat(users[i].tasksDone);
      }
      var dateToday = new Date();
      for(var i = 0; i < tasks.length; i++){

        if( tasks[i].date.getMonth() == dateToday.getMonth() && isInRange(from,to, tasks[i].date.getDate()) ){
          console.log(tasks[i].date)
          console.log("IN");
          numTasksPerHour[tasks[i].date.getHours()-1]++;
        }
      }
      for(var i = 0; i < users.length ; i++ ){
        if(users[i].username == "johncarlo"){
          for(var j = 0; j < users[i].tasksDone.length ; j++){
            if( users[i].tasksDone[j].date.getMonth() == dateToday.getMonth() && isInRange(from, to,users[i].tasksDone[j].date.getDate() )){
              var hour =  users[i].tasksDone[j].date.getHours()-1;
              jc[hour]++;
              jcType[users[i].tasksDone[j].typeOfActivity]++;
            }
            
          }
        }else  if(users[i].username == "jo-en"){
          for(var j = 0; j < users[i].tasksDone.length ; j++){
            if( users[i].tasksDone[j].date.getMonth() == dateToday.getMonth() && isInRange(from, to,users[i].tasksDone[j].date.getDate() )){
              var hour =  users[i].tasksDone[j].date.getHours()-1;
              joen[hour]++;
              joenType[users[i].tasksDone[j].typeOfActivity]++;
            }
            
          }
        }else  if(users[i].username == "ronryan"){
          for(var j = 0; j < users[i].tasksDone.length ; j++){
            if( users[i].tasksDone[j].date.getMonth() == dateToday.getMonth() && isInRange(from, to,users[i].tasksDone[j].date.getDate() )){
              var hour =  users[i].tasksDone[j].date.getHours()-1;
              ron[hour]++;
              ronType[users[i].tasksDone[j].typeOfActivity]++;
            }
            
          }
        }
      }
      var month = dateToday.getMonth();
      return res.render('dashboard_day',{status:true,month:month,ronType: ronType, jcType:jcType, joenType:joenType,numTasksPerHour: numTasksPerHour,ron: ron, joen:joen, jc:jc,blu:blu,ronTotal: ron.reduce(add), joenTotal: joen.reduce(add),jcTotal: jc.reduce(add),bluTotal:0});
     });
     
});


app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("running");
});