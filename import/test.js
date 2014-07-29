var lazy = require("lazy"),
fs = require('fs');

new lazy(fs.createReadStream(__dirname + '/user/exp_dump.cpg132_users.csv', 'r'))
		.lines
		.forEach(function(line) {
				console.log(line.toString());
		}
);