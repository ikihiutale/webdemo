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
// mongoose.connect('mongodb://localhost/imgPloadr'); 
mongoose.connect(process.env.DB_URL);
mongoose.set('debug', true);
console.log('Mongoose connected START');
mongoose.connection.on('open', function() { 
	console.log('Mongoose connected - ' + process.env.DB_URL); 
}); 
app.listen(app.get('port'), function() {    
	console.log('Server up: http://localhost:' + app.get('port')); }); 
