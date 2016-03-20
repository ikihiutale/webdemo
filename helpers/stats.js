var models = require('../models'), 
	async = require('async');

module.exports = function(callback) { 
	console.log("stats Start");
	async.parallel([ 
		   function(next) { 
			   models.Image.count({}, next);
			   // The same in longer way:
			   // models.Image.count({}, function(
			   //		 err, total){ next(err, total); 
			   // }); 
			   
		   }, 
		   function(next) { 
			   models.Comment.count({}, next);
		   }, 
		   function(next) { 
			   // Using MongoDB's aggregate function, we are telling MongoDB to 
			   // group every document together and sum up all of their views 
			   // into a single new field called viewsTotal
			   models.Image.aggregate({ 
				   $group : { _id : '1', viewsTotal : { $sum : '$views' } }}, 
				   function(err, result) { 
					   var viewsTotal = 0; 
					   if (result.length > 0) { 
						   viewsTotal += result[0].viewsTotal;
					   } 
					   next(null, viewsTotal); 
				}); 
		   }, 
		   function(next) {
			   models.Image.aggregate({ 
				   $group : { _id : '1', likesTotal : { $sum : '$likes' } }}, 
				   function (err, result) {
					   var likesTotal = 0; 
					   if (result.length> 0) { 
						   likesTotal += result[0].likesTotal;    
					   } 
					   next(null, likesTotal);
				}); 
		   }], 
		function(err, results) { 
			console.log("stats END");
			callback(null, 
				{ images: results[0], 
				  comments: results[1], 
				  views: results[2],
				  likes: results[3]
				});    
		}
	); 
};