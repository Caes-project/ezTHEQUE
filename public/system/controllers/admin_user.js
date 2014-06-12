'use strict';

angular.module('mean.system').controller('UsersAdminController', ['$scope', '$stateParams','$location','Users','Global', 'Livres', 
    function($scope,$stateParams, $location, Users, Global, Livres) {
		
		$scope.global = Global;
		if($scope.global.isAdmin){
	       Users.findById({
	            userId: $stateParams.userId
	        },function(user){
	            $scope.user = user;
				$scope.getEmprunt();	    		
	        });
	    }

	    $scope.listeEmprunt = [];

		//initialiaze le scope.emprunt
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

	    $scope.validerEmprunt = function(){
	    	console.log($scope.newlivre);
	    };

	    $scope.verifInput = function(){
	    	if($scope.refMedia){
		    	Livres.query({
				    ref: $scope.refMedia
				}, function(livre){
					console.log(livre);
					if(livre[0])
					$scope.newlivre = livre[0];
				});
			}
	    };
}]);