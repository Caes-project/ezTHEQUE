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
        console.log(user);
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


    $scope.listeEmprunts = [];
  //initialiaze le scope.emprunt
  $scope.getEmprunt = function(){
    $scope.nbLivres = $scope.nbMag = $scope.nbBD = $scope.nbCD = $scope.nbDVD = 0;
    var callbackLivre = function(media){
      media.typeMedia='Livres';
      $scope.listeEmprunts.push(media);
      $scope.nbLivres++;
    };
    var callbackMagazine = function(media){
      media.typeMedia='Magazines';
      $scope.listeEmprunts.push(media);
      $scope.nbMag++;
    };
    var callbackBD = function(media){
      media.typeMedia='BD';
      $scope.listeEmprunts.push(media);
      $scope.nbBD++;
    };
    var callbackCD = function(media){
      media.typeMedia='CD';
      $scope.listeEmprunts.push(media);
      $scope.nbCD++;
    };
    var callbackDVD = function(media){
      media.typeMedia='DVD';
      $scope.listeEmprunts.push(media);
      $scope.nbDVD++;
    };

    //récupère la liste des id des medias emprunté
    for(var i in $scope.user.emprunt){
      if($scope.user.emprunt[i].type === 'Livres'){
        Livres.get({
         livreId: $scope.user.emprunt[i].id
       }, callbackLivre);
      }else if($scope.user.emprunt[i].type === 'Magazines'){
        Revues.get({
          revueId: $scope.user.emprunt[i].id
        }, callbackMagazine);
      }else if($scope.user.emprunt[i].type === 'BD'){
        Bds.get({
          bdId: $scope.user.emprunt[i].id
        }, callbackBD);
      }else if($scope.user.emprunt[i].type === 'CD'){
        Cds.get({
          cdId: $scope.user.emprunt[i].id
        }, callbackCD);
      }else if($scope.user.emprunt[i].type === 'DVD'){
        Dvds.get({
          dvdId: $scope.user.emprunt[i].id
        }, callbackDVD);
      }
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

    // var timer;
    // function message_info(message, type){
    //   var res = {};
    //   var time = 2;
    //   if(type === 'error'){
    //    time = 3;
    //   }
    //   res.message = message;
    //   if(type){
    //    res.status = type;
    //   }
    //   if($scope.test){
    //     console.log('gros hack pour les tests');
    //   }else{
    //     $timeout.cancel(timer);
    //     var transition = document.getElementById('message_info');
    //     transition.classList.remove('trans_message');
    //     transition.offsetWidth = transition.offsetWidth;
    //     transition.classList.add('trans_message');
    //     $scope.message_info = res;
    //     timer = $timeout(function(){
    //       $scope.message_info =null;
    //     }, 6000*time);
    //   }
    // }


    // $scope.rendreLivre = function(livre) {
    //   console.log('rendre');
    //   livre.emprunt = {
    //     user: null,
    //     date_debut : null,
    //     date_fin : null
    //   };
    //   for(var i=0; i<$scope.emprunteur.emprunt.length; i++){
    //     if($scope.emprunteur.emprunt[i].id === livre._id){
    //       $scope.emprunteur.emprunt.splice(i, 1);
    //     }
    //  }
    //   // console.log(user);
    //   livre.$update(function(response) {
    //     $scope.emprunteur.$update(function(response){
    //       Global.message_info = livre.title + ' est rendu !';
    //         $location.path('admin/users/' + $scope.emprunteur._id);
    //     });
    //   });
    // };

    $scope.rendreLivre = function(media) {
      console.log(media.typeMedia);
      var emprunteur = media.emprunt.user;
      media.historique.push({
        'user' : emprunteur,
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
      Users.get({
        userId : emprunteur
      }, function(user){
        console.log(user);
        var emprunteur = user;
        for(var i=0; i<emprunteur.emprunt.length; i++){
          if(emprunteur.emprunt[i].id === media._id){
           emprunteur.emprunt.splice(i, 1);
         }
        }
        emprunteur.$update(function(response){
          media.$update(function(response) {    
            Global.message_info = media.title + ' est rendu !';
            $location.path('admin/users/' + emprunteur._id);
          });
        });
      });
    };
}]);
