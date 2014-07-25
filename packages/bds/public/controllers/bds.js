'use strict';

angular.module('mean.bds').controller('BdsController', ['$scope', '$http', '$cookies','$timeout', '$stateParams','$location','Users','Global', 'Bds', 
  function($scope,$http, $cookies, $timeout, $stateParams, $location, Users, Global, Bds) {
    $scope.global = Global;
    // $scope.users = Users;
    $scope.suppr = false;
    $scope.package = {
      name: 'bds'
    };
    $scope.date = new Date().toISOString().substring(0, 10);

    $scope.genre_liste_bd = ['Aventure', 'Erotique', 'Humour', 'Fantastique', 'Bibliographie', 'Manga', 'Enfants', 'Divers'];

    var timer;

    function message_info(message, type){
      var res = {};
      res.message = message;
      if(type){
        res.status = type;
      }
      $timeout.cancel(timer);
      var transition = document.getElementById('message_info');
      transition.classList.remove('trans_message');
      transition.offsetWidth = transition.offsetWidth;
      transition.classList.add('trans_message');
      $scope.message_info = res;
      timer = $timeout(function(){
        $scope.message_info =null;
      }, 6000);
    }



    $scope.hasAuthorization = function(bd) {
      if (!bd) return false;
      return $scope.global.isAdmin;
    };

    $scope.isAdmin = function() {
      return $scope.global.isAdmin;
    };

    $scope.create = function(isValid) {
      if (isValid) {
       var bd = new Bds({
        code_barre : $scope.code_barre_recherche,
        title: this.title,
        auteur: this.auteur,
        cote : this.cote,
        dewey: this.dewey,
        date_acquis: this.date,
        ref: this.ref,
        resume : this.resume,
        lien_image: this.img_google,
        emprunt : {
          'user' : null,
          'date_debut' : null,
          'date_fin' : null
        }
      });
       console.log(bd);
       bd.$save(function(response) {
         message_info('Bd crée avec succès ! ');
         $scope.enregistre = true;
         $scope.bd = bd;
       });
       this.title = '';
       this.auteur = '';
       this.cote = '';
       this.dewey = '';
       this.date_acquis = '';
       this.lien_image = '';
       $scope.ref+=1;
       this.resume = '';
       $scope.code_barre_recherche = '';
       $scope.img_google = '';
       $scope.data = '';

     }else {
      $scope.submitted = true;
    }
  };

  $scope.ajoutImage = function(){
    var formData = new FormData();
    formData.append('file', $scope.image);
    $http({
      method: 'POST',
      url: './uploadImage',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        file : formData
      }
    }).
    then(function(result) {
      console.log(result);
      return result.data;
    });
  };


  $scope.save = function(){
    $scope.suppr = false;
  };

  $scope.save_suppr = function(){
    if($scope.bd.emprunt.user){
      $scope.error=true;
    }else{
      $scope.suppr = true;
    }
  };

  $scope.remove = function(bd) {
    if (bd) {
      console.log('ici');
      bd.$remove(function(response) {
        $location.path('bds');
      });

      for (var i in $scope.bds) {
        if ($scope.bds[i] === bd) {
          $scope.bds.splice(i, 1);
        }
      }
    } else {
      console.log('else');
      $scope.bd.$remove(function(response) {
        $location.path('bds');
      });
    }
  };

  $scope.update = function() {
    var bd = $scope.bd;
    if (!bd.updated) {
      bd.updated = [];
    }
    bd.updated.push(new Date().getTime());

    bd.$update(function() {
      $location.path('bds/' + bd._id);
    });
  };

  $scope.find = function() {
    Bds.query(function(bds) {
      $scope.bds = bds;
    });
  };

  $scope.findOne = function() {
    Bds.get({
      bdId: $stateParams.bdId
    }, function(bd) {
      $scope.bd = bd;
      $scope.ref = bd.ref;
      $scope.dessinateur = bd.dessinateur;
      $scope.scenariste = bd.scenariste;
      $scope.title = bd.title;
      $scope.dewey =  bd.dewey;
      $scope.date_acquis = bd.date_acquis;
      $scope.code_barre_recherche = bd.code_barre;
      $scope.cote = bd.cote;
      $scope.resume = bd.resume;
    });

  };

  $scope.listeUsers = function(){
    $scope.findOne();
    if($scope.global.isAdmin){
      Users.query(function(users){
        console.log(users);
        $scope.users = users;
      });
    }else{
      //noob way just use a query instead of doing some shit :p
      //Also now it's unused
      Users.me({
        userId: $scope.global.user._id
      }, function(user){
        console.log(user);
        $scope.users = user;
        $scope.selectedUser = user;
      });
    }
  };

  $scope.getInfoUser = function(){
    Bds.get({
      bdId: $stateParams.bdId
    }, function(bd) {
      $scope.bd = bd;
      console.log(bd);
      if(bd.emprunt.user){
        Users.findById({
          userId : bd.emprunt.user
        }, function(user){
          $scope.user = user;
        });
      }
    });
  };

  $scope.validerEmprunt = function(){
    var bd = $scope.bd;
    var user = $scope.selectedUser;
    var newEmprunt;
    if(null){
      console.log('erreur bd déjà emprunté');
    }else{
      bd.emprunt.user = $scope.selectedUser._id;
      bd.emprunt.date_debut = $scope.date;
      bd.emprunt.date_fin = $scope.date_fin;
      newEmprunt = {
        id : bd._id,
        date_debut : $scope.date,
        date_fin : $scope.date_fin,
        type : 'BD'
      };
      user.emprunt.push(newEmprunt);
      // console.log(user);
      user.$update(function(response) {
        bd.$update(function(response) {
          $location.path('bds/' + response._id);
        });
      });
    }
  };

  $scope.rendreBd = function(bd) {
    var user;
    // console.log($scope.bd.emprunt.user);
    Users.findById({
      userId: $scope.bd.emprunt.user
    },
    function(user_){
      user = user_;
      bd.historique.push({
        'user' : $scope.user._id,
        'date_debut' : bd.emprunt.date_debut,
        'date_fin' : new Date()
      });
      user.historique.push({
        'media' : bd._id,
        'date_debut' : bd.emprunt.date_debut,
        'date_fin' : new Date()
      });    
      bd.emprunt = {
        user: null,
        date_debut : null,
        date_fin : null
      };
      for(var i=0; i<user.emprunt.length; i++){
        if(user.emprunt[i].id === $scope.bd._id){
          user.emprunt.splice(i, 1);
        }
      }
      // console.log(user);
      $scope.error=false;
      user.$update(function(response){
        bd.$update(function(response) {
          $location.path('bds/' + response._id);
        });
      });
    });
  };

  $scope.recup_google = function(){
    if($scope.code_barre_recherche){
      $scope.enregistre = false;
      Bds.query({
        'code_barre' : $scope.code_barre_recherche
      }, function(bd){
        console.log(bd);
        if(bd[0]){
          message_info('Vous avez déjà un exemplaire de ce bd', 'error');
        }else{
          $http.get('https://www.googleapis.com/books/v1/volumes?q=isbn:'+ $scope.code_barre_recherche).
          success(function(data, status, headers, config){
            console.log(data);
            $scope.data = data;
            //si le bd retourné est unique alors on prérempli les champs.
            if(!data.items){
              message_info('Aucun bd trouvé !', 'error');
              $scope.code_barre = $scope.code_barre_recherche;
            }else if(data.items.length === 1){
              if(data.items[0].volumeInfo.authors){
                $scope.auteur = data.items[0].volumeInfo.authors[0];}
                if(data.items[0].volumeInfo.title){
                  $scope.title = data.items[0].volumeInfo.title;}
                  $scope.code_barre = $scope.code_barre_recherche;
                  if(data.items[0].volumeInfo.imageLinks){
                    $scope.img_google = data.items[0].volumeInfo.imageLinks.thumbnail;
                  }else{
                    console.log('2');
                    $http.get('https://www.googleapis.com/books/v1/volumes?q=' + data.items[0].volumeInfo.title+' '+data.items[0].volumeInfo.authors[0]).
                    success(function(data, status, headers, config){
                      console.log(data);
                      if(data.items[0].volumeInfo.imageLinks){
                        $scope.img_google = data.items[0].volumeInfo.imageLinks.thumbnail;
                      }else{
                        message_info('Aucune couverture dans les données renvoyées par Google', 'error');
                      }
                    });
                  }
                  $scope.lien_bd = data.items[0].volumeInfo;
                  if(data.items[0].volumeInfo.description){
                    $scope.resume = data.items[0].volumeInfo.description;
                  }   
                  $scope.cote = data.items[0].volumeInfo.authors[0].substring(0,3).toUpperCase();
                }
              }).error(function(data, status, headers, config) {
                message_info('Il semblerai que la connection vers google_book soit impossible pour le moment ...', 'error');
              });
            }
          });
    }else{
      message_info('Veuillez entrer un code barre');
    }
  };

  $scope.date_diff = function(bd){
    var today = new Date();
    if(!bd.emprunt.date_fin){
      return 1;
    }
    var fin = new Date(bd.emprunt.date_fin);
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

  $scope.Initref = function(){
    Bds.getMaxRef(function(bd){
      console.log(bd);
      $scope.ref = bd.ref + 1;
    });
  };
}]);
