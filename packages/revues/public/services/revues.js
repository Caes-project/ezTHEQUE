'use strict';

//Revues service used for revues REST endpoint
angular.module('mean.revues').factory('Revues', ['$resource',
	function($resource) {
		return $resource('revues/:revueId/:action', {
			revueId: '@_id'
		}, {
			update: { 
				method: 'PUT'
			},
			getMaxRef : {
                method: 'GET',
                params: {action: 'getMaxRef'},
                isArray: false
            },
            getRevues : {
            	method: 'GET',
                params: {action: 'getRevues'},
                isArray: true
            },
            createRevues : {
            	method: 'GET',
                params: {action: 'createRevues'}
            }
		});
	}
]);
