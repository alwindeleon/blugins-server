var seeder = require('mongoose-seed');
 
// Connect to MongoDB via Mongoose 
seeder.connect('mongodb://heroku_d9ck50r0:6vmdtv0paosgg172farmmdgssn@ds011735.mlab.com:11735/heroku_d9ck50r0', function() {
// seeder.connect('mongodb://localhost/workflow-development', function() {	
	// Load Mongoose models 
	seeder.loadModels([
		'models/member.js'
	]);
 
	// Clear specified collections 
	seeder.clearModels(['Member'], function() {
 
		// Callback to populate DB once collections have been cleared 
		seeder.populateModels(data);
 
	});
});
 
// Data array containing seed data - documents organized by Model 
var data = [
	{ 
		'model': 'Member',
		'documents': [
			{
				'name': 'Alwin',
				'password': '123',
				'username': 'alwin',
				'tasksDone': [
				
				]
			},
			{
				'name': 'Archie',
				'password': '123',
				'username': 'archie',
				'tasksDone':[
					
				]
			},
			{
				'name': 'Jo-en',
				'password': 'secure123',
				'username': 'jo-en',
				'tasksDone':[
				
				]
			},
			{
				'name': 'Ronryan',
				'password': 'secure123',
				'username': 'ronryan',
				'tasksDone':[
				]
			},
			{
				'name': 'John Carlo',
				'password': 'secure123',
				'username': 'johncarlo',
				'tasksDone':[
					
				]
			}
		]
	}
];	
 
 