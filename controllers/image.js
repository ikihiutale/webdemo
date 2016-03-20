var fs = require('fs'),
	path = require('path'), 
	sidebar = require('../helpers/sidebar'),
	common = require('../helpers/common'),
	Models = require('../models'),
	md5 = require('MD5'); 

module.exports = {
	// The index function will display image_id, which is set 
	// in the route when this controller function is executed. 
	// The params property was added to the request object via the 
	// urlencoded feature, which is part of the body parser module
	index: function(req, res) {
		console.log("GET imahe.." + req.params.image_id);
		 // Declare empty viewModel variable object
		var viewModel = {
			image: {}, 
			comments: [] 
		};
		// Find the image by searching an image specifically by its filename.
		// MongoDB's regex filter is used to compare a filename to req.params.image_id, 
		// which is the value of the parameter in the URL as defined in the routes file
		Models.Image.findOne({ filename: { $regex: req.params.image_id } }, function(err, image) { 
			if (err) { throw err; } 
			if (image) { 
				// If the image was found, increment its views counter
				image.views = image.views + 1;
				// Save the image object to the viewModel
				viewModel.image = image;
				// Save the model (since it has been updated)
				image.save();
				// Find all comments with the image_id property 
				// equal to the _id of  the original image model 
				Models.Comment.find({ image_id: image._id},{},{ sort: { 'timestamp': 1 }}, function(err, comments) {
					// Attach the array of found comments to viewModel 
					viewModel.comments = comments;
					// Build the sidebar sending along the viewModel.
					// Waiting to render the HTML for the view until after the 
					// sidebar has completed populating viewModel -  this is because 
					// of the asynchronous nature of Node.js
					sidebar(viewModel, function(viewModel) {    
						// Render the page view with its viewModel 
						res.render('image', viewModel); 
					});                    
				});
			} 
			// If a filename that doesn't exist,  user is simply redirect 
			// the user back to the homepage
			else {    
				// If no image was found, simply go back to the homepage 
				res.redirect('/');
			}
		}); 
	},
	// Save an image to the db. An image is never saved the database 
	// with the same randomly generated filename as an already existing image. 
	// Second, it's ensured that the image is inserted into the database after 
	// it has been successfully uploaded, renamed, and saved to the filesystem
	create: function(req, res) {
		var saveImage = function() {
			var imgUrl = common.randomHex(16);
			console.log("URL " + imgUrl);
			
			Models.Image.find({ filename: imgUrl }, function(err, images) { 
				if (images.length> 0) {  
					// If a matching image was found, try again (start over) 
					saveImage();        
				} 
				else {
					var srcPath = req.file.path,
						srcFile = req.file.filename,
						ext = path.extname(srcFile).toLowerCase(),
						destPath = path.resolve(__dirname, '../public/upload/' + imgUrl + ext);		
						console.log("DEST " + destPath + ", SRC " + srcPath);
					if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
						fs.rename(srcPath, destPath, function(err) {
							if (err) { throw err; }
							// Create a new Image model, populate its details
							var newImg = new Models.Image({ 
								title: req.body.title, 
								filename: imgUrl + ext, 
								description: req.body.description });
							newImg.save(function(err, image) { 
								res.redirect('/images/' + image.uniqueId);
							}); 
						});
					} 
					else {
						// Delete the original file if it's not valid
						fs.unlink(srcPath, function (err) {
							if (err) { throw err; }
					        res.json(500, {error: 'Only image files are allowed.'});
						}); 
					} 
				}
			});
		};
		//res.send('The image:create POST controller');
		saveImage();
	},    
	like: function(req, res) {
		// The image_id is set in the router!!
		Models.Image.findOne({ filename: { $regex: req.params.image_id }  }, function(err, image) { 
			if (!err && image) { 
				image.likes = image.likes + 1; 
				image.save(function(err) { 
					if (err) { res.json(err); } 
					else { 
						res.json({ likes: image.likes });
					}
				});
			} 
		}); 
	},    
	comment: function(req, res) {
		Models.Image.findOne({ filename: { $regex: req.params.image_id } }, function(err, image) { 
			if (!err && image) { 
				// Note:  This HTML form uses form fields that have the same name 
				// and structure as that of a comment model
				var newComment = new Models.Comment(req.body); 
				//  the MD5 hash value of the commenter's e-mail address so 
				// that their Gravatar profile picture can be retrieved 
				newComment.gravatar = md5(newComment.email); 
				newComment.image_id = image._id; 
				newComment.save(function(err, comment) { 
					if (err) { throw err; }
					// For convenience,  a bookmark is appended to the new comment's _id to 
					// the URL so that when the  page loads it will automatically scroll 
					// down to the users' comments that have just been posted. 
					res.redirect('/images/' + image.uniqueId + '#' + comment._id);
				});
			} else { res.redirect('/'); }
		}); 
	},
	
	// TODO replace with async's series 
	// The first task is to find the image that we are attempting to remove. 
	// Once that image is found, the file associated with the image should 
	// be deleted. Next, find the comments associated with the image and 
	// remove them. Once they have been removed, the last step is to remove 
	// the image itself. Assuming all of that was a success, simply send a true 
	// Boolean JSON response back to the browser
	remove: function(req, res) { 
		Models.Image.findOne({ filename: { $regex: req.params.image_id } }, function(err, image) { 
			if (err) { throw err; }
			fs.unlink(path.resolve('./public/upload/' + image.filename), function(err) { 
				if (err) { throw err; }
				Models.Comment.remove({ image_id: image._id}, function(err) { 
					image.remove(function(err) { 
						if (!err) { res.json(true);	/*res.redirect('/');*/ } 
						else { res.json(false); }
					});
					
				});
			});
		}); 
	} 
}; 