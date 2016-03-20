var path = require('path'),    
	routes = require('./routes'),
	// Templating engine 
	exphbs = require('express-handlebars'),
	express = require('express'),
	// Helps parsing any form fields that are submitted 
	// via a HTML form submission from a browser
	bodyParser = require('body-parser'),
	// BodyParser supports only JSON and URL encoded form 
	// submissions and not multipart form submissions that 
	// are used in the case of file upload.
	// The multer module supports the file uploads
	//multer = require('multer'),
	// Allows cookies to be sent and received
	cookieParser = require('cookie-parser'),
	// Automated logging of request/response
	morgan = require('morgan'),
	logger = require('./logger'),
	// For older browsers that don't properly support 
	// REST HTTP verbs the methodOverride allows 
	// this to be faked using a special hidden input field
	methodOverride = require('method-override'),
	// Handles any errors that occur throughout 
	// the entire middleware process
	errorHandler = require('errorhandler'),
	// A library for performing numerous different types of 
	// date string formatting
	moment = require('moment'),
	fs = require('fs'),
	favicon = require('serve-favicon'),
	crypto = require('crypto'),
	path = require('path'); 

//var uploadConf = multer({dest:'public/upload/temp'});

// Convert to hexadecimal format.
// Return required number of characters
function randomValueHex (len) {
	return crypto.randomBytes(Math.ceil(len/2))
		.toString('hex') 
        .slice(0,len);    
}

module.exports = {
	init: function(app) { 
		//app.use(morgan("combined", { "stream": logger.stream }));
		//app.use(morgan('dev'));
		app.use(bodyParser.urlencoded({'extended':true}));
		app.use(bodyParser.json());
		app.use(methodOverride());
		app.use(cookieParser('some-secret-value-here'));
		// Wire up our routes via the app object.
		// Router is used and it responds to requests such as 
		// GET, POST, PUT, and UPDATE
		routes.use(app);
		// Predefined static resource directory for css, js etc.
		// NOTE: it's important that your static middleware is 
		// defined after the app.router() so that static assets aren't 
		// inadvertently taking priority over a matching route that 
		// may have been defined.
		app.use('/public/', express.static(path.join(__dirname, '../public')));
		if ('development' === app.get('env')) {   
			app.use(errorHandler()); 
		}
		// The used file extension here is .handlebars. It could be
		// anything as long as the first parameter to the app.engine() 
		// function and the second parameter in the app.set('view engine') 
		// function are identical. 
		// uncomment after placing your favicon in /public
		//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
		app.engine('handlebars', exphbs.create({    
			defaultLayout: 'main',    
			layoutsDir: app.get('views') + '/layouts',    
			partialsDir: [app.get('views') + '/partials'], 
		 	helpers: { 
		 		timeago: function(timestamp) { 
		 			return moment(timestamp).startOf('minute').fromNow();
		 		}
		 	}
		}).engine);
	
		app.set('view engine', 'handlebars'); 
		
		return app;
	}
};