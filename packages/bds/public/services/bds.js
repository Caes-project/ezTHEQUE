'use strict';

//Bds service used for bds REST endpoint
angular.module('mean.bds').factory('Bds', ['$resource',
	function($resource) {
		return $resource('bds/:bdId/:action', {
			bdId: '@_id'
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
