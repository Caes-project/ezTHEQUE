'use strict';

angular.module('mean.system').controller('UsersAdminController', ['$scope', '$stateParams','$location', '$timeout','Users','Global', 'Livres', '$filter',
    function($scope,$stateParams, $location, $timeout, Users, Global, Livres, $filter) {
		
		$scope.global = Global;
		
		$scope.listeModif = [];		
		
		$scope.option_abo = [{'name' : 'BD, Livres, Magazines'},{'name' : 'Disque'}, {'name' : 'DVD'}];

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
		
		function checkDureeAbo(user){
			var res;
			res = $scope.date_diff_abo(user.livre_mag_revue);
			if(res.retard === 1){
				message_info('Attention il reste '+ res.diff + ' jour(s) avant la fin d\'un abonnement', 'error');
			}
			res = $scope.date_diff_abo(user.DVD);
			if(res.retard === 1){
				message_info('Attention il reste '+ res.diff + ' jour(s) avant la fin d\'un abonnement', 'error');
			}
			res = $scope.date_diff_abo(user.CD);
			if(res.retard === 1){
				message_info('Attention il reste '+ res.diff + ' jour(s) avant la fin d\'un abonnement', 'error');
			}
			res = $scope.date_diff_abo(user.caution);
			if(res.retard === 1){
				message_info('Attention il reste '+ res.diff + ' jour(s) avant la fin d\'un abonnement', 'error');
			}
			res = $scope.date_diff_abo(user.paiement);
			if(res.retard === 1){
				message_info('Attention il reste '+ res.diff + ' jour(s) avant la fin d\'un abonnement', 'error');
			}
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
				checkDureeAbo(user);
	        });
	    }


	    $scope.listeEmprunts = [];

		//initialiaze le scope.emprunt
	    $scope.getEmprunt = function(){
		    var callback = function(media){
				$scope.listeEmprunts.push(media);
			};

    		$scope.emprunt = $scope.user.emprunt;
	    	//récupère la liste des id des medias emprunté
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

        function isAboMedia(user, media){
        	console.log(user.livre_mag_revue);
        	console.log(user.caution);
        	console.log(media.typeMedia);
        	if(media.typeMedia === 'BD, Livres, Magazines' && user.livre_mag_revue && user.caution){
        		console.log('true');
				return true;          	
            }else if(media.typeMedia === 'DVD' && user.DVD && user.caution){
            	return true;
            }else if(media.typeMedia === 'CD' && user.CD && user.caution){
            	return true;
      		}
        	return false;
        }

        var timer;

        function message_info(message, type){
            var res = {};
            var time = 1;
            if(type === 'error'){
            	time = 3;
            }
            res.message = message;
            if(type){
                res.status = type;
            }
           	if($scope.test){
           		console.log('gros hack pour les tests 2');
	        }else{
           		$timeout.cancel(timer);
	            var transition = document.getElementById('message_info');
	            transition.classList.remove('trans_message');
	            transition.offsetWidth = transition.offsetWidth;
	            transition.classList.add('trans_message');
	            $scope.message_info = res;
	            timer = $timeout(function(){
	                $scope.message_info =null;
	            }, 6000*time);
	        }
        }

	    $scope.validerEmprunt = function(){
	    	if($scope.newmedia){
		        var media = $scope.newmedia;
	            var newEmprunt;
	            if(media.emprunt.user){
	                message_info('erreur media déjà emprunté', 'error');
	            }else if(!isAboMedia($scope.user, media)){
	            	message_info('L\'utilisateur n\'est pas abonné à ce type de media', 'error');
	            }else{
	            	delete media.typeMedia;
	                media.emprunt.user = $scope.user._id;
	                media.emprunt.date_debut = $scope.date;
	                media.emprunt.date_fin = $scope.date_fin;
	                newEmprunt = {
	                    id : media._id,
	                    date_debut : $scope.date,
	                    date_fin : $scope.date_fin
	                };            
	                $scope.user.emprunt.push(newEmprunt);
                    media.$update(function(response) {
	                	$scope.user.$update(function(response) {
	                      	$scope.listeEmprunts.push(media);
	                        $scope.derniermedia = $scope.newmedia;
	                        $scope.newmedia = null;
	                        $scope.refMedia = null;
	                        $scope.listeModif.push({'title' : media.title,'type' : 'new', '_id' : media._id});
	                        message_info(media.title + ' est bien emprunté !');
	                    });
	                });
	            }
	        }
        };

        $scope.rendreLivre = function(media) {
        	if(media.emprunt.user !== $scope.user._id){
        		console.log('TODO gros message d\'erreur');
        	}else{
	            media.historique.push({
					'user' : $scope.user._id,
					'date_debut' : media.emprunt.date_debut,
                    'date_fin' : new Date()
				});
				$scope.user.historique.push({
					'media' : media._id,
					'date_debut' : media.emprunt.date_debut,
                    'date_fin' : new Date()
				});	    
	            media.emprunt = {
	                user: null,
	                date_debut : null,
	                date_fin : null
	            };
	            for(var i=0; i<$scope.user.emprunt.length; i++){
	                if($scope.user.emprunt[i].id === media._id){
	                   $scope.user.emprunt.splice(i, 1);
	                }
	                if($scope.listeEmprunts[i]._id === media._id){  
	                   $scope.listeEmprunts.splice(i,1);
	                }
	            }
	            $scope.user.$update(function(response){
	                media.$update(function(response) {
	                    // $location.path('medias/' + response._id);
	                    $scope.derniermedia = $scope.newmedia;
	                    $scope.newmedia = null;
	                    $scope.refMedia = null;
	                    $scope.listeModif.push({'title' : media.title, 'type' : 'old', '_id' : media._id});
	                    message_info(media.title + ' est rendu !');
	                    $timeout(function(){
	                        	$scope.message_info =null;
	                        }, 5000);
	                });
	            });
	        }
        };


	    $scope.verifInput = function(){
		    $scope.newmedia = null;
	    	if($scope.refMedia.length > 8){
		    	Livres.query({
		    		code_barre : $scope.refMedia
		    	},
		    	function(livre){
					if(livre[0]){
						$scope.newmedia = livre[0];
						$scope.newmedia.typeMedia = 'BD, Livres, Magazines';
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
				$scope.newmedia = null;
				Livres.query({
					ref: $scope.refMedia
			    },
			    function(livre){
					if(livre[0]){
						$scope.newmedia = livre[0];
						$scope.newmedia.typeMedia = 'BD, Livres, Magazines';
					}
				});
			}
	    };

	   $scope.date_diff = function(media){
            var today = new Date();
            //Si pas de date_fin alors on ne calcule pas la différence entre les dates
            if(!media.emprunt.date_fin){
                return 1;
            }
            var fin = new Date(media.emprunt.date_fin);
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

        $scope.date_diff_abo = function(abo){
            var today = new Date();
            if(!abo){
                return 1;
            }
            var fin = new Date(abo);
            var diff = fin.getTime()- today.getTime();
            diff = Math.floor(diff / (1000 * 60 * 60 * 24));
            var res = {};
            if(diff >= 15){
                res.retard = 0;
                res.diff = diff;
            }else{
                res.retard = 1;
                res.diff = diff;
            }
            return res;
        };

        $scope.validerNewAbo = function(newAbo){
        	var today = new Date();
            var end = new Date();
            end.setFullYear(today.getFullYear()+1);
            if(newAbo === 'livre_mag_revue'){
            	$scope.user.livre_mag_revue = end;
            }else if(newAbo === 'DVD'){
            	$scope.user.DVD = end;
            }else if(newAbo === 'CD'){
            	$scope.user.CD = end;
      		}else if(newAbo === 'caution'){
            	$scope.user.caution = end;
            }else if(newAbo === 'paiement'){
            	$scope.user.paiement = end;
            }
            $scope.user.$update(function(response){
		   		message_info('Abonnement créé !');
			});
		};
}]);