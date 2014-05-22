'use strict';

//Livres service used for livres REST endpoint
angular.module('mean').factory('Livres', ['$resource',
	function($resource) {
		return $resource('livres/:livreId', {
			livreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
