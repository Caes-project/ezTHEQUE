'use strict';

angular.module('mean.livres').controller('LivresController', ['$scope', 'Global',
    function($scope, Global, Livres) {
        $scope.global = Global;
        $scope.package = {
            name: 'livres'
        };

        $scope.create = function() {
            var livre = new Livres({
                title: this.title,
                genre: this.genre
            });
            livre.$save(function(response) {
                $location.path('livres/' + response._id);
            });

            this.title = '';
            this.genre = '';
        };

        $scope.find = function() {
            Livres.query(function(livres) {
                $scope.livres = livres;
            });
        };
    }
]);
