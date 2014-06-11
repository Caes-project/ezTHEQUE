'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$stateParams','$location','Users','Global', 'Livres', 
    function($scope,$stateParams, $location, Users, Global, Livres) {
   	 $scope.global = Global;
   	 if($scope.global.isAdmin){
       Users.query(function(users){
            $scope.users = users;
        });
    }
}]);