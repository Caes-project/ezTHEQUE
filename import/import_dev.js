var mongoose = require('mongoose');

require('../packages/livres/server/models/livre.js');
require('../packages/bds/server/models/bd.js');
require('../packages/cds/server/models/cd.js');
require('../packages/revues/server/models/revue.js');
require('../packages/dvds/server/models/dvd.js');
require('../packages/users/server/models/user.js');
var Livre = mongoose.model('Livre');
var Bd = mongoose.model('Bd');
var Cd = mongoose.model('Cd');
var Revue = mongoose.model('Revue');
var Dvd = mongoose.model('Dvd');
var User = mongoose.model('User');

mongoose.connect('mongodb://localhost/mean-dev');

Livre.remove({},function(err){
	console.log(err);
	Bd.remove({},function(err){
		console.log(err);
		Cd.remove({},function(err){
			console.log(err);
			Dvd.remove({},function(err){
				console.log(err);
				User.remove({},function(err){
					console.log(err);
					Revue.remove({},function(err){
						console.log(err);
						mongoose.connection.close()
					});
				});
			});
		});
	});
});
