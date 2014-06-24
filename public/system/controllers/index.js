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


}]);