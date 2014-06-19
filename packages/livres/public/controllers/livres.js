'use strict';

angular.module('mean').controller('LivresController', ['$scope', '$http', '$stateParams','$location','Users','Global', 'Livres', 
    function($scope,$http, $stateParams, $location, Users, Global, Livres) {
        $scope.global = Global;
        // $scope.users = Users;
        $scope.suppr = false;
        $scope.package = {
            name: 'livres'
        };
        $scope.date = new Date().toISOString().substring(0, 10);

        $scope.hasAuthorization = function(livre) {
            if (!livre) return false;
            return $scope.global.isAdmin;
        };

        $scope.isAdmin = function() {
            return $scope.global.isAdmin;
        };

        //unused
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


        $scope.save = function(){
            $scope.suppr = false;
        };

        $scope.save_suppr = function(){
            $scope.suppr = true;
        };

        $scope.remove = function(livre) {
            if (livre) {
                console.log('ici');
                livre.$remove(function(response) {
                    $location.path('livres');
                });

                for (var i in $scope.livres) {
                    if ($scope.livres[i] === livre) {
                        $scope.livres.splice(i, 1);
                    }
                }
            } else {
                console.log('else');
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
                console.log(livre);
                $scope.livre = livre;
                $scope.ref = livre.ref;
                $scope.auteur = livre.auteur;
                $scope.title = livre.title;
                $scope.dewey =  livre.dewey;
                $scope.date_acquis = livre.date_acquis;

            });

        };

        $scope.listeUsers = function(){
            $scope.findOne();
            if($scope.global.isAdmin){
               Users.query(function(users){
                    console.log(users);
                    $scope.users = users;
                });
            }else{
                Users.me({
                    userId: $scope.global.user._id
                }, function(user){
                    console.log(user);
                    $scope.users = user;
                    $scope.selectedUser = user;
                });
            }
        };

        $scope.validerEmprunt = function(){
            var livre = $scope.livre;
            var user = $scope.selectedUser;
            var newEmprunt;
            if(null){
                console.log('erreur livre déjà emprunté');
            }else{
                livre.emprunt.user = $scope.selectedUser._id;
                livre.emprunt.date_debut = $scope.date;
                livre.emprunt.date_fin = $scope.date_fin;
                newEmprunt = {
                    id : livre._id,
                    date_debut : $scope.date,
                    date_fin : $scope.date_fin
                };
                user.emprunt.push(newEmprunt);
                // console.log(user);
                user.$update(function(response) {
                    livre.$update(function(response) {
                        $location.path('livres/' + response._id);
                    });
                });
            }
        };

        $scope.rendreLivre = function(livre) {
            var user;
            // console.log($scope.livre.emprunt.user);
            Users.findById({
                    userId: $scope.livre.emprunt.user
                },
                 function(user_){
                    console.log(JSON.stringify(user_));
                    user = user_;
                    livre.emprunt = {
                        user: null,
                        date_debut : null,
                        date_fin : null
                    };
                    for(var i=0; i<user.emprunt.length; i++){
                        if(user.emprunt[i].id === $scope.livre._id){
                           user.emprunt.splice(i, 1);
                        }
                    }
                    // console.log(user);
                    user.$update(function(response){
                        livre.$update(function(response) {
                            $location.path('livres/' + response._id);
                        });
                    });
            });
        };

        $scope.recup_google = function(){
            $http.get('https://www.googleapis.com/books/v1/volumes?q=isbn:'+ $scope.code_barre_recherche).
                success(function(data, status, headers, config){
                    console.log(data);
                    $scope.data = data;
                    //si le livre retourné est unique alors on prérempli les champs.
                    if(data.items.length === 1){
                        $scope.auteur = data.items[0].volumeInfo.authors[0];
                        $scope.title = data.items[0].volumeInfo.title;
                        $scope.code_barre = $scope.code_barre_recherche;
                        $scope.img_google = data.items[0].volumeInfo.imageLinks.thumbnail;
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log('error ! errror !');
                });
        };

    }
]);
