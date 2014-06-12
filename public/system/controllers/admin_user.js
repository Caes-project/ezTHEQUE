'use strict';

angular.module('mean.system').controller('UsersAdminController', ['$scope', '$stateParams','$location','Users','Global', 'Livres', 
    function($scope,$stateParams, $location, Users, Global, Livres) {
		
		$scope.global = Global;
		
		$scope.date = new Date().toISOString().substring(0, 10);
		// $scope.date_fin = new Date((new Date()).valueOf() + 1000*3600*24*7).toISOString().substring(0, 10);
		$scope.date_fin = $scope.date;

		if($scope.global.isAdmin){
	       Users.findById({
	            userId: $stateParams.userId
	        },function(user){
	            $scope.user = user;
				$scope.getEmprunt();	    		
	        });
	    }

	    $scope.listeEmprunt = [];


	    function incr_date(date_str){
		    var parts = date_str.split('-');
		    var dt = new Date(
		         parseInt(parts[0], 10),      // year
		         parseInt(parts[1], 10) - 1,  // month (starts with 0)
		         parseInt(parts[2], 10)       // date
		     );
		 	dt.setDate(dt.getDate() + 7);
			 parts[0] = '' + dt.getFullYear();
			 parts[1] = '' + (dt.getMonth() + 1);
			 if (parts[1].length < 2) {
			    parts[1] = '0' + parts[1];
			}
			parts[2] = '' + dt.getDate();
			if (parts[2].length < 2) {
			    parts[2] = '0' + parts[2];
			}
			return parts.join('-');
		}

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

	    $scope.onChangeDate = function(){
	    	$scope.date_fin = incr_date($scope.date);
	    };

	    $scope.validerEmprunt = function(){
	    	if($scope.newlivre){
		        var livre = $scope.newlivre;
	            var user = $scope.user;
	            var newEmprunt;
	            if(null){
	                console.log('erreur livre déjà emprunté');
	            }else{
	                livre.emprunt.user = user._id;
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
	        }else{
	           	console.log('lol');
	        }
        };


	    $scope.verifInput = function(){
	    	if($scope.refMedia){
		    	Livres.query({
				    ref: $scope.refMedia
				}, function(livre){
					console.log(livre);
					if(livre[0]){
						$scope.newlivre = livre[0];
					}
					else{
						$scope.newlivre = null;
					}
				});
			}
	    };
}]);