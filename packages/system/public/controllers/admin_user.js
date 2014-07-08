'use strict';

angular.module('mean.system').controller('UsersAdminController', ['$scope', '$stateParams','$location', '$timeout','Users','Global', 'Livres', '$filter',
    function($scope,$stateParams, $location, $timeout, Users, Global, Livres, $filter) {
		
		$scope.global = Global;
		
		$scope.listeModif = [];		
		
		$scope.option_abo = [{'name' : 'BD'}, {'name' : 'Livres' }, {'name' : 'Disque'}, {'name' : 'Magazines' }, {'name' : 'DVD'}];

		$scope.newAbo = {};

		if($scope.global.message_info){
			$scope.message_info = $scope.global.message_info;
			delete $scope.global.message_info;
			$timeout(function(){
            	$scope.message_info =null;
            }, 5000);
		}

        $scope.isOpen2 = false;

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
		
		$scope.date = new Date().toISOString().substring(0, 10);
		// $scope.date_fin = new Date((new Date()).valueOf() + 1000*3600*24*7).toISOString().substring(0, 10);
		$scope.date_fin = incr_date($scope.date);

		if($scope.global.isAdmin){
	       Users.findById({
	            userId: $stateParams.userId
	        },function(user){
	            $scope.user = user;
				$scope.getEmprunt();
				console.log(user);
				// $scope.user.abonnement[2].paiement = true;	    		
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

	    $scope.onChangeDate = function(){
	    	$scope.date_fin = incr_date($scope.date);
	    };

		$scope.selectedAbo = function () {
            $scope.abo_select = $filter('filter')($scope.option_abo, {checked: true});
        };

	    $scope.validerEmprunt = function(){
	    	if($scope.newlivre){
		        var livre = $scope.newlivre;
		        console.log(livre);
	            var newEmprunt;
	            if(livre.emprunt.user){
	                console.log('erreur livre déjà emprunté');
	            }else{
	                livre.emprunt.user = $scope.user._id;
	                livre.emprunt.date_debut = $scope.date;
	                livre.emprunt.date_fin = $scope.date_fin;
	                newEmprunt = {
	                    id : livre._id,
	                    date_debut : $scope.date,
	                    date_fin : $scope.date_fin
	                };
	                $scope.user.emprunt.push(newEmprunt);
	                // console.log(user);
                    livre.$update(function(response) {
	                	$scope.user.$update(function(response) {
	                        // $location.path('admin/users/' + response._id);
	                        $scope.listeEmprunt.push(livre);
	                        $scope.dernierlivre = $scope.newlivre;
	                        $scope.newlivre = null;
	                        $scope.refMedia = null;
	                        $scope.message_info = livre.title + ' est bien emprunté !';
	                        $scope.listeModif.push({'title' : livre.title,'type' : 'new', '_id' : livre._id});
	                        $timeout(function(){
	                        	$scope.message_info =null;
	                        }, 5000);
	                    });
	                });
	            }
	        }
        };

        $scope.rendreLivre = function(livre) {
        	if(livre.emprunt.user !== $scope.user._id){
        		console.log('TODO gros message d\'erreur');
        	}else{
	            livre.emprunt = {
	                user: null,
	                date_debut : null,
	                date_fin : null
	            };
	            for(var i=0; i<$scope.user.emprunt.length; i++){
	                if($scope.user.emprunt[i].id === livre._id){
	                   $scope.user.emprunt.splice(i, 1);
	                }
	                if($scope.listeEmprunt[i]._id === livre._id){  
	                   $scope.listeEmprunt.splice(i,1);
	                }
	            }
	            // console.log(user);
	            $scope.user.$update(function(response){
	                livre.$update(function(response) {
	                    // $location.path('livres/' + response._id);
	                    $scope.dernierlivre = $scope.newlivre;
	                    $scope.newlivre = null;
	                    $scope.refMedia = null;
	                    $scope.listeModif.push({'title' : livre.title, 'type' : 'old', '_id' : livre._id});
	                    $scope.message_info = livre.title + ' est rendu !';
	                    $timeout(function(){
	                        	$scope.message_info =null;
	                        }, 5000);
	                });
	            });
	        }
        };


	    $scope.verifInput = function(){
		    $scope.newlivre = null;
	    	if($scope.refMedia.length > 8){
		    	Livres.query({
		    		code_barre : $scope.refMedia
		    	},
		    	function(livre){
					if(livre[0]){
						$scope.newlivre = livre[0];
						if(livre[0].emprunt.user === $scope.user._id){
							$scope.rendreLivre(livre[0]);
							$scope.refMedia = null;
						}else{
							$scope.validerEmprunt();
							$scope.refMedia = null;
						}
					}
				});
			}	 
		    else{
				$scope.newlivre = null;
				Livres.query({
					ref: $scope.refMedia
			    },
			    function(livre){
					if(livre[0]){
						$scope.newlivre = livre[0];
					}
				});
			}
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

        function isInArray(tab,elem){
        	for(var i in tab){
        		if(tab[i].nom === elem){
        			return true;
        		}
        	}
        	return false;
        }

        $scope.validerNewAbo = function(newAbo){
        	var today = new Date();
            var end = new Date();
            end.setFullYear(today.getFullYear()+1);
            if(newAbo.name){
            	if(!isInArray($scope.user.abonnement, newAbo.name)){
	            	$scope.user.abonnement.push({
	                    'nom' : newAbo.name,
	                    'date_debut' : today,
	                    'date_fin' : end,
	                    'paiement': false,
	                    'caution' : false
	                });
	                $scope.user.$update(function(response){
		                if(!$scope.message_info){
			                $scope.message_info = 'Abonnement créé !';
			                $timeout(function(){
			                	$scope.message_info =null;
			                }, 5000);
			            }
			        });
	            }else{
	                if(!$scope.message_info){
		            	$scope.message_info = 'Abonnement déjà effectif';
		                $timeout(function(){
		                	$scope.message_info =null;
		                }, 5000);
	            	}
	            }
	        }
            console.log($scope.user);
		};

		$scope.aboCaution = function(abo){
			console.log(abo);
			for(var i in $scope.user.abonnement){
				if($scope.user.abonnement[i].nom ===  abo.nom){
					$scope.user.abonnement[i].caution =!$scope.user.abonnement[i].caution;
				}
			}
			$scope.user.$update(function(response){
				if(!$scope.message_info){
	            	$scope.message_info = 'Changement validé';
	                $timeout(function(){
	                	$scope.message_info =null;
	                }, 5000);
            	}
			});
		};

		$scope.aboPaiement = function(abo){
			console.log(abo);
			for(var i in $scope.user.abonnement){
				if($scope.user.abonnement[i].nom ===  abo.nom){
					$scope.user.abonnement[i].paiement =!$scope.user.abonnement[i].paiement;
				}
			}
			$scope.user.$update(function(response){
				if(!$scope.message_info){
	            	$scope.message_info = 'Changement validé';
	                $timeout(function(){
	                	$scope.message_info =null;
	                }, 5000);
            	}
			});
		};
}]);