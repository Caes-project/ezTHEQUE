'use strict';

angular.module('mean.bd').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('bd example page', {
            url: '/bd/example',
            templateUrl: 'bd/views/index.html'
        });
    }
]);
