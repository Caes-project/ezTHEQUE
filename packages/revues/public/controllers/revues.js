'use strict';

angular.module('mean.revues').controller('RevuesController', ['$scope', '$http', '$cookies','$timeout', '$stateParams','$location','Users','Global', 'Revues', 
    function($scope,$http, $cookies, $timeout, $stateParams, $location, Users, Global, Revues) {
        $scope.global = Global;
        // $scope.users = Users;
        $scope.suppr = false;
        $scope.package = {
            name: 'revues'
        };
        $scope.date = new Date().toISOString().substring(0, 7);

        Revues.getRevues(function(liste_revues){
                $scope.liste_revues = liste_revues;
        });

        var timer;

        function message_info(message, type){
            var res = {};
            res.message = message;
            if(type){
                res.status = type;
            }
           $timeout.cancel(timer);
            var transition = document.getElementById('message_info');
            transition.classList.remove('trans_message');
            transition.offsetWidth = transition.offsetWidth;
            transition.classList.add('trans_message');
            $scope.message_info = res;
            timer = $timeout(function(){
                $scope.message_info =null;
            }, 6000);
        }

       $scope.majTitre = function(){
            $scope.title = $scope.revue + ' : ' + $scope.date + ' n°' + $scope.numero;
       };

        $scope.hasAuthorization = function(revue) {
            if (!revue) return false;
            return $scope.global.isAdmin;
        };

        $scope.isAdmin = function() {
            return $scope.global.isAdmin;
        };

        $scope.create = function(isValid) {
            if (isValid) {
               var revue = new Revues({
                    code_barre : $scope.code_barre_recherche,
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
                console.log(revue);
                revue.$save(function(response) {
                   message_info('Revue crée avec succès ! ');
                   $scope.enregistre = true;
                   $scope.revue = revue;
                });
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
            if($scope.revue.emprunt.user){
                $scope.error=true;
            }else{
                $scope.suppr = true;
            }
        };

        $scope.remove = function(revue) {
            if (revue) {
                console.log('ici');
                revue.$remove(function(response) {
                    $location.path('revues');
                });

                for (var i in $scope.revues) {
                    if ($scope.revues[i] === revue) {
                        $scope.revues.splice(i, 1);
                    }
                }
            } else {
                console.log('else');
                $scope.revue.$remove(function(response) {
                    $location.path('revues');
                });
            }
        };

        $scope.update = function() {
            var revue = $scope.revue;
            if (!revue.updated) {
                revue.updated = [];
            }
            revue.updated.push(new Date().getTime());

            revue.$update(function() {
                $location.path('revues/' + revue._id);
            });
        };

        $scope.find = function() {
            Revues.query(function(revues) {
                $scope.revues = revues;
            });
        };

        $scope.findOne = function() {
            Revues.get({
                revueId: $stateParams.revueId
            }, function(revue) {
                $scope.revue = revue;
                $scope.ref = revue.ref;
                $scope.auteur = revue.auteur;
                $scope.title = revue.title;
                $scope.dewey =  revue.dewey;
                $scope.date_acquis = revue.date_acquis;
                $scope.code_barre_recherche = revue.code_barre;
                $scope.cote = revue.cote;
                $scope.resume = revue.resume;
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
            Revues.get({
                revueId: $stateParams.revueId
            }, function(revue) {
                $scope.revue = revue;
                console.log(revue);
                if(revue.emprunt.user){
                    Users.findById({
                        userId : revue.emprunt.user
                    }, function(user){
                        $scope.user = user;
                    });
                }
            });
        };

        $scope.validerEmprunt = function(){
            var revue = $scope.revue;
            var user = $scope.selectedUser;
            var newEmprunt;
            if(null){
                console.log('erreur revue déjà emprunté');
            }else{
                revue.emprunt.user = $scope.selectedUser._id;
                revue.emprunt.date_debut = $scope.date;
                revue.emprunt.date_fin = $scope.date_fin;
                newEmprunt = {
                    id : revue._id,
                    date_debut : $scope.date,
                    date_fin : $scope.date_fin
                };
                user.emprunt.push(newEmprunt);
                // console.log(user);
                user.$update(function(response) {
                    revue.$update(function(response) {
                        $location.path('revues/' + response._id);
                    });
                });
            }
        };

        $scope.rendreRevue = function(revue) {
            var user;
            // console.log($scope.revue.emprunt.user);
            Users.findById({
                    userId: $scope.revue.emprunt.user
                },
                 function(user_){
                    user = user_;
                    revue.emprunt = {
                        user: null,
                        date_debut : null,
                        date_fin : null
                    };
                    for(var i=0; i<user.emprunt.length; i++){
                        if(user.emprunt[i].id === $scope.revue._id){
                           user.emprunt.splice(i, 1);
                        }
                    }
                    // console.log(user);
                    $scope.error=false;
                    user.$update(function(response){
                        revue.$update(function(response) {
                            $location.path('revues/' + response._id);
                        });
                    });
            });
        };

        $scope.date_diff = function(revue){
            var today = new Date();
            if(!revue.emprunt.date_fin){
                return 1;
            }
            var fin = new Date(revue.emprunt.date_fin);
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
            Revues.getMaxRef(function(revue){
                console.log(revue);
                $scope.ref = revue.ref + 1;
            });
        };

        $scope.createAbo = function(){
            $scope.date_renouvellement = new Date(this.date_abo);
            console.log($scope.date_renouvellement);
            // $scope.date_renouvellement.setFullYear($scope.date_renouvellement.getFullYear()+1);
            Revues.createRevues({
                nom : this.nom,
                date_abo : this.date_abo,
                date_renouvellement :  $scope.date_renouvellement.setFullYear($scope.date_renouvellement.getFullYear()+1)
            }, function(pattern_revue){
                console.log(pattern_revue);
                $scope.liste_revues.push(pattern_revue);
            });
        };
    }
]);
