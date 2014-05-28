'use strict';

angular.module('mean.cd').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('cd example page', {
            url: '/cd/example',
            templateUrl: 'cd/views/index.html'
        });
    }
]);
