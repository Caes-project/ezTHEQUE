'use strict';

angular.module('mean.livres').controller('LivresController', ['$scope', '$location', 'Global', 'Livres',
    function($scope, $location, Global, Livres) {
        $scope.global = Global;
        $scope.package = {
            name: 'livres'
        };

        $scope.create = function() {
            console.log(Livres);
            var livre = new Livres({
                title: this.title,
                genre: this.genre
            });
            console.log(livre);
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
