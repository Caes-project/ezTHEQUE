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



}]);