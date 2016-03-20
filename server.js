var express = require('express'),
	config = require('./server/configure'),
	mongoose = require('mongoose'),
	app = express();
// The process.env.PORT constant is an environment 
// setting that is set on the actual machine for the 
// default port value to the server
if(!process.env.PORT) {
	var env = require('./server/env.js');
}
app.set('port', process.env.PORT || 3300);
// Location of views (HTML templates) 
app.set('views', __dirname + '/views'); 
// Initializes the app
app = config.init(app);
var dbURL = process.env.MONGOLAB_URI || 'mongodb://localhost/imgPloadr';

mongoose.set('debug', true);
//console.log('Mongoose STARTING ' + dbURL);
mongoose.connect(dbURL);

mongoose.connection.on('connected', function () {  
	  console.log('Mongoose default connection open to ' + dbURL);
	}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});
	
app.listen(app.get('port'), function() {    
	console.log('Server up: http://localhost:' + app.get('port')); 
}); 
