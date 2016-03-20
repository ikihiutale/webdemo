var sidebar = require('../helpers/sidebar'),
	ImageModel = require('../models').Image;

module.exports = {
	index: function(req, res) {
		console.log("Miksi ei toimi");
		var viewModel = {    
				images: []
		};
		// Waiting to render the HTML for the view until after the 
		// sidebar has completed populating viewModel -  this is because 
		// of the asynchronous nature of Node.js
		sidebar(viewModel, function(viewModel) {
			console.log("Miksi ei toimi 2");
			ImageModel.find({}, {}, { sort: { timestamp: -1 }}, function(err, images) { 
				console.log("Miksi ei toimi 3");
				if (err) { throw err; }
				console.log("Miksi ei toimi 4");
				viewModel.images = images; 
				sidebar(viewModel, function(viewModel) { 
					console.log("Miksi ei toimi 5");
					res.render('index', viewModel);
				});
			}); 
		}); 
	} 
}; 