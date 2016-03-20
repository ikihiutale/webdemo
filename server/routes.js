var express = require('express'),
	path = require('path'),
	router = express.Router(),
	// BodyParser supports only JSON and URL encoded form 
	// submissions and not multipart form submissions that 
	// are used in the case of file upload.
	// The multer module supports the file uploads
	multer = require('multer'),
	home = require('../controllers/home'),
	image = require('../controllers/image');

// WARNING: Make sure that you always handle the files that a user uploads. 
// Never add multer as a global middleware since a malicious user could 
// upload files to a route that you didn't anticipate. Only use this 
// function on routes where you are handling the uploaded files.
var multerStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log("Destination: " + path.join(__dirname, '../public/upload/temp'));
		cb(null, path.join(__dirname, '../public/upload/temp'));
	},
	filename: function (req, fileObj, cb) {
		cb(null, fileObj.originalname); 
	}
});

var uploadImg = multer({ storage: multerStorage });

module.exports = {
	use: function(app) {
		router.get('/', home.index);
		router.get('/images/:image_id', image.index);
		router.post('/images', uploadImg.single('mfile'), image.create);
		router.post('/images/:image_id/like', image.like);
		router.post('/images/:image_id/comment', image.comment);
		router.delete('/images/:image_id', image.remove); 
		app.use(router);
	},
	initialize: function(app) {
		app.get('/', home.index);
		app.get('/images/:image_id', image.index);
		app.post('/images', image.create);
		app.post('/images/:image_id/like', image.like);
		app.post('/images/:image_id/comment', image.comment);
		app.delete('/images/:image_id', image.remove); 
	}
}; 