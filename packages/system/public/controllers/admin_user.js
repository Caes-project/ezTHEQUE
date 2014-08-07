'use strict';

angular.module('mean.system').controller('UsersAdminController', ['$scope', '$stateParams','$location', '$timeout','Users','Global', 'Livres', 'Revues', 'Cds','Dvds','Bds', '$filter',
  function($scope,$stateParams, $location, $timeout, Users, Global, Livres, Revues, Cds, Dvds, Bds, $filter) {

    $scope.global = Global;

     Livres.getSettings(function(settings){
        $scope.settings = settings.settings;
    });

    function incr_date(date_str, typeMedia){

      var today = new Date();
      var nbjour = 7;
      switch (typeMedia) {
        case 'Livres' : nbjour = $scope.settings.delay_livre; break; 
        case 'BD' : nbjour = $scope.settings.delay_BD; break; 
        case 'CD' : nbjour = $scope.settings.delay_CD; break; 
        case 'DVD' : nbjour = $scope.settings.delay_DVD; break; 
        case 'Magazines' : nbjour = $scope.settings.delay_revue; break; 
      }
     
      var fin = new Date();
      fin.setDate(today.getDate() + nbjour);
      return fin;
    }

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

    $scope.date = new Date().toISOString().substring(0, 10);
    // $scope.date_fin = new Date((new Date()).valueOf() + 1000*3600*24*7).toISOString().substring(0, 10);
    $scope.date_fin = incr_date($scope.date);

    if($scope.global.isAdmin){
     Users.findById({
      userId: $stateParams.userId
    },function(user){
      $scope.user = user;
      $scope.getEmprunt();
      checkDureeAbo(user);
    });
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

  $scope.onChangeDate = function(){
    $scope.date_fin = incr_date($scope.date);
  };

  $scope.selectedAbo = function () {
    $scope.abo_select = $filter('filter')($scope.option_abo, {checked: true});
  };

  function incrementNb(typeMedia){
    switch(typeMedia){
      case 'Livres' : $scope.nbLivres++; break;
      case 'BD' : $scope.nbBD++; break;
      case 'Magazines' : $scope.nbMag++; break;
      case 'CD' : $scope.nbCD++; break;
      case 'DVD' : $scope.nbDVD++; break;
    }
  }

  function decrementNb(typeMedia){
    switch(typeMedia){
      case 'Livres' : $scope.nbLivres--; break;
      case 'BD' : $scope.nbBD--; break;
      case 'Magazines' : $scope.nbMag--; break;
      case 'CD' : $scope.nbCD--; break;
      case 'DVD' : $scope.nbDVD--; break;
    }
  }

  function isAboMedia(user, media){
    if( (media.typeMedia === 'BD' || media.typeMedia === 'Livres' || media.typeMedia === 'Magazines') && user.livre_mag_revue && user.caution){
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

  $scope.validerEmprunt = function(){
    if($scope.newmedia){
      var media = $scope.newmedia;
      var newEmprunt;
      if(media.emprunt.user){
        message_info('erreur media déjà emprunté', 'error');
      }else if(!isAboMedia($scope.user, media)){
        message_info('L\'utilisateur n\'est pas abonné à ce type de media', 'error');
      }else{
        media.emprunt.user = $scope.user._id;
        media.emprunt.date_debut = $scope.date;
        media.emprunt.date_fin = incr_date($scope.date, media.typeMedia);
        newEmprunt = {
          id : media._id,
          date_debut : $scope.date,
          date_fin : $scope.date_fin,
          type : media.typeMedia
        };    
        var typeMedia =media.typeMedia;
        delete media.typeMedia;     
        $scope.user.emprunt.push(newEmprunt);
        media.$update(function(response) {
         $scope.user.$update(function(response) {
          media.typeMedia = typeMedia;
          $scope.listeEmprunts.push(media);
          incrementNb(typeMedia);
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
       if($scope.listeEmprunts[i]._id === media._id){  
         $scope.listeEmprunts.splice(i,1);
       }
     }
     var typeMedia =media.typeMedia;
     $scope.user.$update(function(response){
      media.$update(function(response) {
        console.log(response);
        decrementNb(typeMedia);
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