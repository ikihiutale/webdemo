var stats = require('./stats'),
	Images = require('./images'),
	Comments = require('./comments'),
	async = require('async');

// Called from crontroller/image
module.exports = function(viewModel, cb) { 
	console.log("sidebar...1");
	async.parallel([
	  function(next) {
		  console.log("sidebar...2");
		  stats(next);
	  }, 
	  function(next) { 
		  console.log("sidebar...3");
		  Images.popular(next); 
	  }, 
	  function(next) { 
		  console.log("sidebar...4");
		  Comments.newest(next);
	  }],
	  // The last parameter to the parallel function is an inline 
	  // function that accepts a results array as its second parameter. 
	  // This array is a collection of each of the results that were returned 
	  // from each of the functions in the array in the first parameter. 
	  function(err, results){ 
		console.log("sidebar...5");
		viewModel.sidebar = { 
			stats: results[0], 
			popular: results[1], 
			comments: results[2]};
		cb(viewModel);
	}); 
}; 

