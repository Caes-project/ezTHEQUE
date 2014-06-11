'use strict';

//Livres service used for livres REST endpoint
angular.module('mean').factory('Livres', ['$resource',
	function($resource) {
		return $resource('livres/:livreId', {
			livreId: '@_id'
		}, {
			update: { method: 'PUT'	},
			'index':   { method: 'GET', isArray: true },
	        'show':    { method: 'GET', isArray: false },
	    	'destroy': { method: 'DELETE' }
		});
	}
]);
