'use strict';

angular.module('mean.dvds').controller('DvdsController', ['$scope', '$http', '$cookies','$timeout', '$stateParams','$location','Users','Global', 'Dvds', 'Livres',
  function($scope,$http, $cookies, $timeout, $stateParams, $location, Users, Global, Dvds, Livres) {
    $scope.global = Global;
    // $scope.users = Users;
    $scope.suppr = false;
    $scope.package = {
      name: 'dvds'
    };
    $scope.date = new Date().toISOString().substring(0, 10);

    $scope.genre_liste_dvd = ['Animation', 'Aventure/Action' ,'Comédie', 'Comédie dramatique', 'Documentaire', 'Fantastique/Horreur', 'Historique/Guerre', 'Musical', 'Policier/Suspense', 'Science Fiction', 'Théatre', 'Western'];
  
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



    $scope.hasAuthorization = function(dvd) {
      if (!dvd) return false;
      return $scope.global.isAdmin;
    };

    $scope.isAdmin = function() {
      return $scope.global.isAdmin;
    };

    $scope.create = function(isValid) {
      if (isValid) {
       var dvd = new Dvds({
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
       console.log(dvd);
       dvd.$save(function(response) {
         message_info('Dvd crée avec succès ! ');
         $scope.enregistre = true;
         $scope.dvd = dvd;
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
    if($scope.dvd.emprunt.user){
      $scope.error=true;
    }else{
      $scope.suppr = true;
    }
  };

  $scope.remove = function(dvd) {
    if (dvd) {
      console.log('ici');
      dvd.$remove(function(response) {
        $location.path('dvds');
      });

      for (var i in $scope.dvds) {
        if ($scope.dvds[i] === dvd) {
          $scope.dvds.splice(i, 1);
        }
      }
    } else {
      console.log('else');
      $scope.dvd.$remove(function(response) {
        $location.path('dvds');
      });
    }
  };

  $scope.update = function() {
    var dvd = $scope.dvd;
    if (!dvd.updated) {
      dvd.updated = [];
    }
    dvd.updated.push(new Date().getTime());

    dvd.$update(function() {
      $location.path('dvds/' + dvd._id);
    });
  };
  
  $scope.loader=true;
  $scope.find = function() {
     Dvds.query(function(dvds) {
        $scope.dvds = dvds;
        $scope.loader = false;
      }, function(err){
        $scope.loader = false;
        message_info('Le serveur à échouer à charger les dvds', 'error');
        console.log(err);
      });
  };

  $scope.findOne = function() {
    Dvds.get({
      dvdId: $stateParams.dvdId
    }, function(dvd) {
      $scope.dvd = dvd;
      $scope.ref = dvd.ref;
      $scope.info = dvd.info;
      $scope.ref_adav = dvd.ref_adav;
      $scope.realisateur = dvd.realisateur;
      $scope.duree = dvd.duree;
      $scope.annee = dvd.annee;
      $scope.acteur = dvd.acteur;
      $scope.title = dvd.title;
      $scope.dewey =  dvd.dewey;
      $scope.date_acquis = dvd.date_acquis;
      $scope.code_barre_recherche = dvd.code_barre;
      $scope.cote = dvd.cote;
      $scope.resume = dvd.resume;
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
    recupActif();
    Dvds.get({
      dvdId: $stateParams.dvdId
    }, function(dvd) {
      $scope.dvd = dvd;
      console.log(dvd);
      if(dvd.emprunt.user){
        Users.findById({
          userId : dvd.emprunt.user
        }, function(user){
          $scope.user = user;
        });
      }
    });
  };

  $scope.usersActifs = [];

    function recupActif(){
      Users.query(function(users){
        $scope.users = users;
        $scope.users.forEach(function(user){
          if($scope.checkActif(user)){
            $scope.usersActifs.push(user);
          } 
        });
      });
    }

    $scope.nbAboDVD = 0;

    $scope.checkActif = function(user){
      var time = 1000 * 60 * 60 * 24;
      var today = new Date();
      var fin_DVD = new Date(user.DVD);
      var diff_DVD = fin_DVD.getTime()- today.getTime();
      // var fin_caution = new Date(user.caution);
      // var diff_caution = fin_caution.getTime()- today.getTime();

      // if(Math.floor(diff_DVD / time) >=-30 && Math.floor(diff_caution / time) >=-30){
      if(Math.floor(diff_DVD / time) >=-30){
        $scope.nbAboDVD++;
        return true;
      }
      return false;
    };

    $scope.selectUser = function(user){
      $scope.selectedUser = user;
      $scope.validerEmprunt();
    };

    $scope.validerEmprunt = function(){
      if(!$scope.selectedUser){
        message_info('choisissez un utilisateur !', 'error');
        return 1;
      }
      var dvd = $scope.dvd;
      var user = $scope.selectedUser;
      var newEmprunt;
      dvd.emprunt.user = $scope.selectedUser._id;
      dvd.emprunt.date_debut = $scope.date;
      dvd.emprunt.date_fin = incr_date($scope.date, 'DVD');
      newEmprunt = {
        id : dvd._id,
        date_debut : $scope.date,
        date_fin : incr_date($scope.date, 'DVD'),
        type: 'DVD'
      };
      user.emprunt.push(newEmprunt);
      user.$update(function(response) {
        dvd.$update(function(response) {
          $location.path('dvds/' + response._id);
          $scope.emprunt = false;
          $scope.searchUser= null;
          message_info('Emprunt validé');
          $scope.user = user;
        });
      });
    };

  $scope.rendreDvd = function(dvd) {
    var user;
    // console.log($scope.dvd.emprunt.user);
    Users.findById({
      userId: $scope.dvd.emprunt.user
    },
    function(user_){
      user = user_;
      dvd.historique.push({
        'user' : $scope.user._id,
        'date_debut' : dvd.emprunt.date_debut,
        'date_fin' : new Date()
      });
      user.historique.push({
        'media' : dvd._id,
        'date_debut' : dvd.emprunt.date_debut,
        'date_fin' : new Date()
      });    
      dvd.emprunt = {
        user: null,
        date_debut : null,
        date_fin : null
      };
      for(var i=0; i<user.emprunt.length; i++){
        if(user.emprunt[i].id === $scope.dvd._id){
          user.emprunt.splice(i, 1);
        }
      }
      // console.log(user);
      $scope.error=false;
      user.$update(function(response){
        dvd.$update(function(response) {
          message_info('média rendu avec succès');
          $location.path('dvds/' + response._id);
        });
      });
    });
  };

  $scope.recup_google = function(){
    if($scope.code_barre_recherche){
      $scope.enregistre = false;
      Dvds.query({
        'code_barre' : $scope.code_barre_recherche
      }, function(dvd){
        console.log(dvd);
        if(dvd[0]){
          message_info('Vous avez déjà un exemplaire de ce dvd', 'error');
        }else{
          $http.get('https://www.googleapis.com/books/v1/volumes?q=isbn:'+ $scope.code_barre_recherche).
          success(function(data, status, headers, config){
            console.log(data);
            $scope.data = data;
            //si le dvd retourné est unique alors on prérempli les champs.
            if(!data.items){
              message_info('Aucun dvd trouvé !', 'error');
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
                  $scope.lien_dvd = data.items[0].volumeInfo;
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

  $scope.date_diff = function(dvd){
    var today = new Date();
    if(!dvd.emprunt.date_fin){
      return 1;
    }
    var fin = new Date(dvd.emprunt.date_fin);
    var diff = fin.getTime()- today.getTime();
    diff = Math.floor(diff / (1000 * 60 * 60 * 24));
    var res = {};
    if(diff >= 0){
      if($scope.global.isAdmin){
        res.message = 'Média emprunté par ' +  dvd.emprunt.user.name + ' Il reste ' + diff + ' jour(s) avant le retour en rayon.'; 
      }else{
        res.message = 'Il reste ' + diff + ' jour(s) avant le retour en rayon.'; 
      }
      res.retard = 0;
    }else{
      if($scope.global.isAdmin){
        res.message = 'Média emprunté par ' +  dvd.emprunt.user.name + ' Il y a ' + diff*-1 + ' jour(s) de retard sur la date de retour prévu.'; 
      }else{
        res.message = 'Il y a ' + diff*-1 + ' jour(s) de retard sur la date de retour prévu.'; 
      }
      res.retard = 1;
    }
    return res;
  };

  $scope.Initref = function(){
    Dvds.getMaxRef(function(dvd){
      console.log(dvd);
      $scope.ref = dvd.ref + 1;
    });
  };

}]);
