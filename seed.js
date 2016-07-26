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
					{
						'subject': "Test 1",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 2",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 3",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 4",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 5",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					}
				]
			},
			{
				'name': 'Archie',
				'password': '123',
				'username': 'archie',
				'tasksDone':[
					{
						'subject': "Test 1",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 2",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 3",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 4",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 5",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					}
				]
			},
			{
				'name': 'Jo-en',
				'password': '123',
				'username': 'jo-en',
				'tasksDone':[
					{
						'subject': "Test 1",
				        'typeOfActivity': 2,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 2",
				        'typeOfActivity': 4,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 3",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 4",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 5",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					}
				]
			},
			{
				'name': 'Ronryan',
				'password': '123',
				'username': 'ronryan',
				'tasksDone':[
					
					{
						'subject': "Test 2",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 3",
				        'typeOfActivity': 1,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 4",
				        'typeOfActivity': 3,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 5",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					}
				]
			},
			{
				'name': 'John Carlo',
				'password': '123',
				'username': 'johncarlo',
				'tasksDone':[
					{
						'subject': "Test 1",
				        'typeOfActivity': 2,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 2",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					},
					{
						'subject': "Test 3",
				        'typeOfActivity': 0,
				        'timeToFinish': 60,
				        'volume': 1,
				        'date': new Date()
					}
				]
			}
		]
	}
];	
 
 