'use strict';

//Dvds service used for dvds REST endpoint
angular.module('mean.dvds').factory('Dvds', ['$resource',
	function($resource) {
		return $resource('dvds/:dvdId/:action', {
			dvdId: '@_id'
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
