var models = require('../models');
module.exports = { 
	popular: function(callback) { 
		console.log("Imagess Start");
		models.Image.find({}, {}, { limit: 9, sort: { likes: -1 }}, function(err, images) { 
			if (err) { throw err; }
			console.log("Images END");
			callback(null, images);
		}); 
	}
};
