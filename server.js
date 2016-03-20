var express = require('express'),	
	mongoose = require('mongoose'),
	config = require('./server/configure'),
	logger = require('./server/logger'),
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

//Configure mongoose for debug
mongoose.set('debug', function (coll, method, query, doc, options) {
	// Mongoose: images.findOne({ _id: ObjectId("56eebc4185621303004f70e9") }) { fields: undefined }
	var queryTmp = JSON.stringify(query),
    	optionsTmp = JSON.stringify(options || {});
	logger.debug('Moongoose: %s.%s(%s) %s', coll, method, queryTmp, optionsTmp);
});

mongoose.connect(dbURL);

mongoose.connection.on('connected', function () {  
	logger.debug('Mongoose default connection open to ' + dbURL);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
	logger.error('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
	logger.info('Mongoose default connection disconnected'); 
});
	
app.listen(app.get('port'), function() {    
	logger.debug('Server up - port:' + app.get('port')); 
}); 
