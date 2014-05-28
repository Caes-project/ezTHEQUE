'use strict';

angular.module('mean.cd').controller('CdController', ['$scope', 'Global',
    function($scope, Global, Cd) {
        $scope.global = Global;
        $scope.package = {
            name: 'cd'
        };
    }
]);
