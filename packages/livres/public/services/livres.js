'use strict';

//Livres service used for livres REST endpoint
angular.module('mean').factory('Livres', ['$resource',
	function($resource) {
		return $resource('livres/:livreId/:action', {
			livreId: '@_id'
		}, {
			update: { 
				method: 'PUT'
			},
			getMaxRef : {
                method: 'GET',
                params: {action: 'getMaxRef'},
                isArray: false
            }
		});
	}
]);
