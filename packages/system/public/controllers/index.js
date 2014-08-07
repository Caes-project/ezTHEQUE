'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$stateParams','$location','Users','Global', 'Livres', 'Revues', 'Cds','Dvds','Bds', '$timeout',
  function($scope,$stateParams, $location, Users, Global, Livres, Revues, Cds, Dvds, Bds, $timeout) {
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

    $scope.checkActif = function(user){
      if($scope.listeAll) return true;
      var time = 1000 * 60 * 60 * 24;
      var today = new Date();
      var fin_caution = new Date(user.caution);
      var fin_paiement = new Date(user.paiement);
      var fin_livre_mag_revue = new Date(user.livre_mag_revue);
      var fin_DVD = new Date(user.DVD);
      var fin_CD = new Date(user.CD);
      var diff_caution = fin_caution.getTime()- today.getTime();
      var diff_paiement = fin_paiement.getTime()- today.getTime();
      var diff_livre_mag_revue = fin_livre_mag_revue.getTime()- today.getTime();
      var diff_DVD = fin_DVD.getTime()- today.getTime();
      var diff_CD = fin_CD.getTime()- today.getTime();
      if(Math.floor(diff_caution / time) >=-30){
        return true;
      }
      if(Math.floor(diff_paiement / time) >=-30){
        return true;
      }
      if(Math.floor(diff_livre_mag_revue / time) >=-30){
        return true;
      }
      if(Math.floor(diff_DVD / time) >=-30){
        return true;
      }
      if(Math.floor(diff_CD / time) >=-30){
        return true;
      }
      return false;
    };


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

   function verifMediaRef(media, type){
      if(media[0]){
        $scope.newmedia = media[0];
        $scope.newmedia.typeMedia = type;
      }
    }

    function verifMediaCB(media, type){
       if(media[0]){
         $scope.newmedia = media[0];
         $scope.newmedia.typeMedia = type;
         if(media[0].emprunt.user === $scope.user._id){
          $scope.rendreLivre(media[0]);
          $scope.refMedia = null;
        }else{
          $scope.validerEmprunt();
          $scope.refMedia = null;
        }
      }
    }

    function getLivre(type){
      if(type === 'CB'){
       Livres.query({
         code_barre : $scope.refMedia
       },
       function(livre){
        verifMediaCB(livre, 'Livres');
      });
     }
     else if (type === 'Ref'){
       Livres.query({
        ref: $scope.refMedia
      },
      function(livre){
        verifMediaRef(livre, 'Livres');
      });
     }
    }

    function getBd(type){
      if(type === 'CB'){
       Bds.query({
         code_barre : $scope.refMedia
       },
       function(livre){
        verifMediaCB(livre, 'BD');
      });
     }
     else if (type === 'Ref'){
       Bds.query({
        ref: $scope.refMedia
      },
      function(livre){
        verifMediaRef(livre, 'BD');
      });
     }
    }

    function getRevue(type){
      if(type === 'CB'){
       Revues.query({
         code_barre : $scope.refMedia
       },
       function(livre){
        verifMediaCB(livre, 'Magazines');
      });
     }
     else if (type === 'Ref'){
       Revues.query({
        ref: $scope.refMedia
      },
      function(livre){
        verifMediaRef(livre, 'Magazines');
      });
     }
    }

    function getCD(type){
      if(type === 'CB'){
       Cds.query({
         code_barre : $scope.refMedia
       },
       function(livre){
        verifMediaCB(livre, 'CD');
      });
     }
     else if (type === 'Ref'){
       Cds.query({
        ref: $scope.refMedia
      },
      function(livre){
        verifMediaRef(livre, 'CD');
      });
     }
    }

    function getDVD(type){
      if(type === 'CB'){
       Dvds.query({
         code_barre : $scope.refMedia
       },
       function(livre){
        verifMediaCB(livre, 'DVD');
      });
     }
     else if (type === 'Ref'){
       Dvds.query({
        ref: $scope.refMedia
      },
      function(livre){
        verifMediaRef(livre, 'DVD');
      });
     }
    }

    $scope.verifInput = function(){
      console.log('lol');
      $scope.newmedia = null;
      if($scope.refMedia && $scope.refMedia.length > 12){
        getLivre('CB');
        getBd('CB');
        getRevue('CB');
        getCD('CB');
        getDVD('CB');
      }  
      else if($scope.refMedia && $scope.refMedia.length > 3){
        $scope.newmedia = null;
        getLivre('Ref');
        getBd('Ref');
        getRevue('Ref');
        getCD('Ref');
        getDVD('Ref');
      }
    };

    var timer;
    function message_info(message, type){
      var res = {};
      var time = 2;
      if(type === 'error'){
       time = 3;
      }
      res.message = message;
      if(type){
       res.status = type;
      }
      if($scope.test){
        console.log('gros hack pour les tests');
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

    $scope.rendreLivre = function(media) {
    console.log(media.typeMedia);
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
     }
     $scope.user.$update(function(response){
      media.$update(function(response) {    
        $scope.newmedia = null;
        $scope.refMedia = null;
        message_info(media.title + ' est rendu !');
        $timeout(function(){
          $scope.message_info =null;
        }, 5000);
      });
    });
   }
  };
}]);
