'use strict';

//Cds service used for cds REST endpoint
angular.module('mean.cds').factory('Cds', ['$resource',
	function($resource) {
		return $resource('cds/:cdId/:action', {
			cdId: '@_id'
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
