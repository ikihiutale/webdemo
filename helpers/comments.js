var models = require('../models'), 
	async = require('async');

// Query MongoDB and retrieve and attach an image 
// model to a comment model. The next callback as 
// the second parameter is important because it's the 
// key to how async module used in the newest function is 
// able to function
var attachImage = function(comment, next) { 
	models.Image.findOne({ _id : comment.image_id}, function(err, image) { 
		if (err) { throw err; } 
		// Comment's schema virtual property is used when the image model is attached
		// to the comment. Likewise, when when getting the image property, the _image
		// prperty is retrieved via Image's shema virtual property.
		comment.image = image; 
		// The next callback as the second parameter is important because 
		// it's the key to how async is able to function
		next(err);
	}); 
};

module.exports = {
	newest: function(cb) {
		console.log("comment 1");
		// The first parameter in the find query is an empty 
		// JavaScript object, meaning that every comment in the database
		// is retrieved 
		models.Comment.find({}, {}, { limit: 5, sort: { 'timestamp': -1 }  }, function(err, comments){
			console.log("comment 2");
			// To use the each function of async to apply that function 
			// to every item in the comments collection.
			// Every comment in the comment's array will be passed individually 
			// to the attachImage function. When the entire collection has been iterated through, 
			// the final callback will execute, which basically fires the very first callback 
			// function that was passed into the newest function as its only parameter
			async.each(comments, attachImage, function(err) { 
				console.log("comment 3..");
				if (err) { throw err; } 
				cb(err, comments);
			}); 
		});
		console.log("comment 4 END");
	}
};