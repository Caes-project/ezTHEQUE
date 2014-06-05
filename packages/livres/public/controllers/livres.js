'use strict';

angular.module('mean').controller('LivresController', ['$scope', '$stateParams','$location','Users','Global', 'Livres', 
    function($scope,$stateParams, $location, Users, Global, Livres) {
        $scope.global = Global;
        $scope.users = Users;
        $scope.package = {
            name: 'livres'
        };
        $scope.date = new Date().toISOString().substring(0, 10);

        $scope.hasAuthorization = function(livre) {
            if (!livre) return false;
            return $scope.global.isAdmin || livre.user._id === $scope.global.user._id;
        };

        $scope.isAdmin = function() {
            return $scope.global.isAdmin;
        };

        $scope.create = function() {
           var livre = new Livres({
                title: this.title,
                auteur: this.auteur,
                dewey: this.dewey,
                date_acquis: this.date,
                ref: this.ref,
                lien_image: this.image
            });
            console.log(livre);
            livre.$save(function(response) {
                $location.path('livres/' + response._id);
            });
            this.title = '';
            this.auteur = '';
            this.dewey = '';
            this.date_acquis = '';
            this.lien_image = '';
            this.ref= '';
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

        $scope.listeUsers = function(){
            $scope.findOne();
            if($global.user.isAdmin()){
                Users.query(function(users){
                    console.log(users);
                    $scope.users = users;
                });
            }else{
                $scope.users = global.user;
            }
        };

        $scope.validerEmprunt = function(){
            // console.log($scope.selectedUser);
            if(livre.emprunt.users){
                console.log('erreur livre déjà emprunté');
            }else{
                livre.emprunt.user = selectedUser._id;
                livre.emprunt.date_début = ;
                livre.emprunt.date_fin = ;
            }
        }
    }
]);