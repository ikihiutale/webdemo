var crypto = require('crypto'),
	util = require('util');

module.exports = {
	randomHex: function(len) {
		try {
			var tmp = crypto.pseudoRandomBytes(Math.ceil(len / 2));
			return tmp.toString('hex').slice(0, len).toLowerCase();
		} 
		catch (ex) {
			// TODO: handle error. Most likely, entropy sources are drained
		}
	},
	objLogger: function(obj) {
		if(obj) {
			console.log(util.inspect(obj, { showHidden: true, depth: null }));
		}
	}
};
