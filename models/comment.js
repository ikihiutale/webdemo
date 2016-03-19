var mongoose = require('mongoose'),
	Schema = mongoose.Schema, 
	ObjectId = Schema.ObjectId;

var CommentSchema = new Schema(
	{ 
		// A field labeled image_id, which has an 
		// ObjectId type, is going to be used to 
		// store the relationship between comment 
		// and image that it was posted to
		image_id: { type: ObjectId }, 
		email: { type: String }, 
		name: { type: String }, 
		gravatar: { type: String }, 
		comment: { type: String }, 
		timestamp: { type: Date, 'default': Date.now } 
	});

CommentSchema.virtual('image').set(function(image) { 
	this._image = image; }).get(function() {
		return this._image;
	});

// A model defined as Comment will have a collection in MongoDB named comments
module.exports = mongoose.model('Comment', CommentSchema);
