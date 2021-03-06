var sidebar = require('../helpers/sidebar'),
	logger = require('../server/logger'),
	ImageModel = require('../models').Image;

module.exports = {
	index: function(req, res) {
		var viewModel = {    
				images: []
		};
		// Waiting to render the HTML for the view until after the 
		// sidebar has completed populating viewModel -  this is because 
		// of the asynchronous nature of Node.js
		sidebar(viewModel, function(viewModel) {
			ImageModel.find({}, {}, { sort: { timestamp: -1 }}, function(err, images) { 
				if (err) { throw err; }
				viewModel.images = images; 
				sidebar(viewModel, function(viewModel) { 
					res.render('index', viewModel);
				});
			}); 
		}); 
	} 
}; 