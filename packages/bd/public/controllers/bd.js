'use strict';

angular.module('mean.bd').controller('BdController', ['$scope', 'Global', 'Bd',
    function($scope, Global, Bd) {
        $scope.global = Global;
        $scope.package = {
            name: 'bd'
        };
    }
]);
