'use strict';

angular.module('mean.livres').controller('LivresController', ['$scope', '$stateParams','$location', 'Global', 'Livres',
    function($scope,$stateParams, $location, Global, Livres) {
        $scope.global = Global;
        $scope.package = {
            name: 'livres'
        };

        $scope.hasAuthorization = function(article) {
            if (!article || !article.user) return false;
            return $scope.global.isAdmin || article.user._id === $scope.global.user._id;
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


        $scope.remove = function(livre) {
            if (livre) {
                livre.$remove();

                for (var i in $scope.livres) {
                    if ($scope.livres[i] === livre) {
                        $scope.livres.splice(i, 1);
                    }
                }
            } else {
                $scope.livre.$remove(function(response) {
                    $location.path('livres');
                });
            }
        };

        $scope.update = function() {
            var livre = $scope.livre;
            if (!livre.updated) {
                livre.updated = [];
            }
            livre.updated.push(new Date().getTime());

            livre.$update(function() {
                $location.path('livres/' + livre._id);
            });
        };

        $scope.find = function() {
            Livres.query(function(livres) {
                $scope.livres = livres;
            });
        };

        $scope.findOne = function() {
            Livres.get({
                livreId: $stateParams.livreId
            }, function(livre) {
                $scope.livre = livre;
            });
        };
    }
]);
