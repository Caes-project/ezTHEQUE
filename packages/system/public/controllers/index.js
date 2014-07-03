'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$stateParams','$location','Users','Global', 'Livres', 
    function($scope,$stateParams, $location, Users, Global, Livres) {
	   	$scope.global = Global;
	   	
	   	if($scope.global.isAdmin){
	        Users.query(function(users){
	            $scope.users = users;
	    	});
    	}

    	if($scope.global.authenticated){
    		Users.me({
                    userId: $scope.global.user._id
                }, function(user){
                	$scope.user = user;
                	$scope.getEmprunt();	    		
                });

            Livres.query({

            }, function(livres){
                $scope.livre_dispo = livres.length;
            });

    	}


    	$scope.listeEmprunt = [];
		//initialiaze le scope
	    $scope.getEmprunt = function(){
		    var callback = function(livre){
				$scope.listeEmprunt.push(livre);
			};

    		$scope.emprunt = $scope.user.emprunt;
	    	//récupère la liste des id des livres emprunté
	    	for(var i in $scope.emprunt){
		   		Livres.get({
				    livreId: $scope.emprunt[i].id
				}, callback);
	    	}
	    };

	    $scope.date_diff = function(livre){
            var today = new Date();
            var fin = new Date(livre.emprunt.date_fin);
            var diff = fin.getTime()- today.getTime();
            diff = Math.floor(diff / (1000 * 60 * 60 * 24));
            var mess;
            if(diff >= 0){
            	mess = 'Il reste ' + diff + ' jour(s) avant le retour en rayon.'; 
            }else{
            	mess = 'Il y a' + diff*-1 + ' jour(s) de retard sur la date de retour prévu.'; 
            }
            return mess;
        };

        //maybe make hot the callbacks
        $scope.verifInput = function(){
            $scope.newlivre = null;
            if($scope.refMedia){
                Livres.query({
                    code_barre : $scope.refMedia
                },
                function(livre){
                    if(livre[0]){
                        $scope.newlivre = livre[0];
                        if($scope.newlivre.emprunt.user){
                            Users.query({
                                '_id' : $scope.newlivre.emprunt.user
                            },function(users){
                                $scope.emprunteur = users[0];
                            });
                        }
                    }
                    else{
                        $scope.newlivre = null;
                        Livres.query({
                            ref: $scope.refMedia
                        },
                        function(livre){
                            if(livre[0]){
                                $scope.newlivre = livre[0];
                                if($scope.newlivre.emprunt.user){
                                    Users.query({
                                        '_id' : $scope.newlivre.emprunt.user
                                    },function(users){
                                        $scope.emprunteur = users[0];
                                    });
                                }
                            }
                        });
                    }
                });
            }
        };


        $scope.rendreLivre = function(livre) {
            console.log('rendre');
            livre.emprunt = {
                user: null,
                date_debut : null,
                date_fin : null
            };
            for(var i=0; i<$scope.emprunteur.emprunt.length; i++){
                if($scope.emprunteur.emprunt[i].id === livre._id){
                   $scope.emprunteur.emprunt.splice(i, 1);
                }
            }
            // console.log(user);
            livre.$update(function(response) {
                $scope.emprunteur.$update(function(response){
                    Global.message_info = livre.title + ' est rendu !';
                    $location.path('admin/users/' + $scope.emprunteur._id);
                });
            });
           
        };

        

}]);