'use strict';

angular.module('mean').controller('LivresController', ['$scope', '$http', '$cookies','$timeout', '$stateParams','$location','Users','Global', 'Livres', 
    function($scope,$http, $cookies, $timeout, $stateParams, $location, Users, Global, Livres) {
        $scope.global = Global;
        // $scope.users = Users;
        $scope.suppr = false;
        $scope.package = {
            name: 'livres'
        };
        $scope.date = new Date().toISOString().substring(0, 10);

        $scope.genre_liste_livre = ['Science-fiction', 'Policier', 'Romans français', 'Romans anglais', 'Romans allemands', 'Romans italiens', 'Romans espagnols', 'Romans, divers', 'Documentaire'];

        function message_info(message, type){
            var res = {};
            res.message = message;
            if(type){
                res.status = type;
            }
            // if(!$scope.message_info){
                $scope.message_info = res;
                $timeout(function(){
                    $scope.message_info =null;
                }, 5000);
            // }
        }

        $scope.hasAuthorization = function(livre) {
            if (!livre) return false;
            return $scope.global.isAdmin;
        };

        $scope.isAdmin = function() {
            return $scope.global.isAdmin;
        };

        $scope.create = function(isValid) {
            if (isValid) {
               var livre = new Livres({
                    code_barre : this.code_barre,
                    title: this.title,
                    auteur: this.auteur,
                    cote : this.cote,
                    dewey: this.dewey,
                    date_acquis: this.date,
                    ref: this.ref,
                    resume : this.resume,
                    lien_image: this.img_google,
                    emprunt : {
                        'user' : null,
                        'date_debut' : null,
                        'date_fin' : null
                    }
                });
                console.log(livre);
                livre.$save(function(response) {
                   message_info('Livre crée avec succès ! ');
                });
                this.code_barre = '';
                this.title = '';
                this.auteur = '';
                this.cote = '';
                this.dewey = '';
                this.date_acquis = '';
                this.lien_image = '';
                $scope.ref+=1;
                this.resume = '';
                $scope.code_barre_recherche = '';
                $scope.img_google = '';
                $scope.data = '';

            }else {
                $scope.submitted = true;
            }
        };


        $scope.save = function(){
            $scope.suppr = false;
        };

        $scope.save_suppr = function(){
            if($scope.livre.emprunt.user){
                $scope.error=true;
            }else{
                $scope.suppr = true;
            }
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
                //noob way just use a query instead of doing some shit :p
                //Also now it's unused
                Users.me({
                    userId: $scope.global.user._id
                }, function(user){
                    console.log(user);
                    $scope.users = user;
                    $scope.selectedUser = user;
                });
            }
        };

        $scope.getInfoUser = function(){
            if($cookies.info_mess){
                $scope.message_info=decodeURI($cookies.info_mess);
            }else{
                $scope.message_info = null;
            }
            Livres.get({
                livreId: $stateParams.livreId
            }, function(livre) {
                $scope.livre = livre;
                console.log(livre);
                if(livre.emprunt.user){
                    Users.findById({
                        userId : livre.emprunt.user
                    }, function(user){
                        $scope.user = user;
                    });
                }
            });
            $timeout(function(){
                $scope.message_info =null;
                delete $cookies.info_mess;       
            }, 5000);
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
                    $scope.error=false;
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
                    if(!data.items){
                        message_info('Aucun livre trouvé !', 'error');
                        $scope.code_barre = $scope.code_barre_recherche;
                    }else if(data.items.length === 1){
                        if(data.items[0].volumeInfo.authors){
                            $scope.auteur = data.items[0].volumeInfo.authors[0];}
                        if(data.items[0].volumeInfo.title){
                            $scope.title = data.items[0].volumeInfo.title;}
                        $scope.code_barre = $scope.code_barre_recherche;
                        if(data.items[0].volumeInfo.imageLinks){
                            $scope.img_google = data.items[0].volumeInfo.imageLinks.thumbnail;
                        }else{
                            console.log('2');
                            $http.get('https://www.googleapis.com/books/v1/volumes?q=' + data.items[0].volumeInfo.title+' '+data.items[0].volumeInfo.authors[0]).
                                success(function(data, status, headers, config){
                                     console.log(data);
                                     if(data.items[0].volumeInfo.imageLinks){
                                        $scope.img_google = data.items[0].volumeInfo.imageLinks.thumbnail;
                                     }else{
                                         $scope.status = 'Aucune couverture dans les données renvoyées par Google';
                                     }
                                });
                        }
                        $scope.lien_livre = data.items[0].volumeInfo;
                        if(data.items[0].volumeInfo.description){
                            $scope.resume = data.items[0].volumeInfo.description;
                        }   
                        $scope.cote = data.items[0].volumeInfo.authors[0].substring(0,3).toUpperCase();
                    }
                }).
                error(function(data, status, headers, config) {
                    console.log('error ! errror !');
                });
        };

        $scope.date_diff = function(livre){
            var today = new Date();
            if(!livre.emprunt.date_fin){
                return 1;
            }
            var fin = new Date(livre.emprunt.date_fin);
            var diff = fin.getTime()- today.getTime();
            diff = Math.floor(diff / (1000 * 60 * 60 * 24));
            var res = {};
            if(diff >= 0){
                res.message = 'Il reste ' + diff + ' jour(s) avant le retour en rayon.'; 
                res.retard = 0;
            }else{
                res.message = 'Il y a ' + diff*-1 + ' jour(s) de retard sur la date de retour prévu.'; 
                res.retard = 1;
            }
            return res;
        };

        $scope.Initref = function(){
            Livres.getMaxRef(function(livre){
                console.log(livre);
                $scope.ref = livre.ref + 1;
            });
        };
    }
]);
