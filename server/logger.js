var winston = require('winston'),
	fs = require( 'fs' ),
	path = require('path'),
	logDir = path.join(__dirname, '../public/logs'),
	env = process.env.NODE_ENV || 'development';

winston.emitErrs = true;

if ( !fs.existsSync( logDir ) ) {
	// Create the directory if it does not exist
	fs.mkdirSync( logDir );
}


var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
        	// silly=0(lowest), debug=1, verbose=2, 
        	// info=3, warn=4, error=5(highest)
            level: 'info',
            filename: path.join(logDir + '/logs.log'),
            handleExceptions: true,
            json: true,
            maxsize: 1024 * 512, // 0.5MB
            maxFiles: 2,
            colorize: false
        }),
        new winston.transports.Console({
            level: env === 'development' ? 'debug' : 'info',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding) {
    	// Remove extra line breaks
    	if(message) {
    		message = message.replace(/(\r\n|\n|\r)/gm,"");
    	}
        logger.info(message);
    }
};