'use strict';

angular.module('mean.revues').controller('RevuesController', ['$scope', '$http', '$cookies', '$timeout', '$stateParams', '$location', 'Users', 'Global', 'Revues', 'Livres',
  function($scope, $http, $cookies, $timeout, $stateParams, $location, Users, Global, Revues, Livres) {
    $scope.global = Global;
    // $scope.users = Users;
    $scope.suppr = false;
    $scope.package = {
      name: 'revues'
    };
    $scope.date = new Date().toISOString().substring(0, 7);

    Revues.getRevues(function(liste_revues) {
      $scope.liste_revues = liste_revues;
    });

    var timer;

    function message_info(message, type) {
      var res = {};
      var time = 2;
      if (type === 'error') {
        time = 3;
      }
      res.message = message;
      if (type) {
        res.status = type;
      }
      if ($scope.test) {
        console.log('gros hack pour les tests');
      } else {
        $timeout.cancel(timer);
        var transition = document.getElementById('message_info');
        transition.classList.remove('trans_message');
        transition.offsetWidth = transition.offsetWidth;
        transition.classList.add('trans_message');
        $scope.message_info = res;
        timer = $timeout(function() {
          $scope.message_info = null;
        }, 6000 * time);
      }
    }

    if ($cookies.message_info) {
      message_info(decodeURI($cookies.message_info));
      delete $cookies.message_info;
    }

    Livres.getSettings(function(settings) {
      $scope.settings = settings.settings;
    });

    function incr_date(date_str, typeMedia) {

      var today = new Date();
      var nbjour = 7;
      switch (typeMedia) {
        case 'Livres':
          nbjour = $scope.settings.delay_livre;
          break;
        case 'BD':
          nbjour = $scope.settings.delay_BD;
          break;
        case 'CD':
          nbjour = $scope.settings.delay_CD;
          break;
        case 'DVD':
          nbjour = $scope.settings.delay_DVD;
          break;
        case 'Magazines':
          nbjour = $scope.settings.delay_revue;
          break;
      }

      var fin = new Date();
      fin.setDate(today.getDate() + nbjour);
      return fin;
    }

    $scope.majTitre = function() {
      $scope.title = $scope.nom_revue + ' : ' + $scope.date + ' n°' + $scope.numero;
    };

    $scope.hasAuthorization = function(revue) {
      if (!revue) return false;
      return $scope.global.isAdmin;
    };

    $scope.isAdmin = function() {
      return $scope.global.isAdmin;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var revue = new Revues({
          code_barre: $scope.code_barre_recherche,
          title: this.title,
          auteur: this.auteur,
          cote: this.cote,
          dewey: this.dewey,
          date_acquis: this.date,
          ref: this.ref,
          resume: this.resume,
          lien_image: this.img_google,
          emprunt: {
            'user': null,
            'date_debut': null,
            'date_fin': null
          }
        });
        console.log(revue);
        revue.$save(function(response) {
          message_info('Revue crée avec succès ! ');
          $scope.enregistre = true;
          $scope.revue = revue;
        });
        this.title = '';
        this.auteur = '';
        this.cote = '';
        this.dewey = '';
        this.date_acquis = '';
        this.lien_image = '';
        $scope.ref += 1;
        this.resume = '';
        $scope.code_barre_recherche = '';
        $scope.img_google = '';
        $scope.data = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.save = function() {
      $scope.suppr = false;
    };

    $scope.save_suppr = function() {
      if ($scope.revue.emprunt.user) {
        $scope.error = true;
      } else {
        $scope.suppr = true;
      }
    };

    $scope.remove = function(revue) {
      if (revue) {
        console.log('ici');
        revue.$remove(function(response) {
          $location.path('revues');
        });

        for (var i in $scope.revues) {
          if ($scope.revues[i] === revue) {
            $scope.revues.splice(i, 1);
          }
        }
      } else {
        console.log('else');
        $scope.revue.$remove(function(response) {
          $location.path('revues');
        });
      }
    };

    $scope.update = function() {
      var revue = $scope.revue;
      if (!revue.updated) {
        revue.updated = [];
      }
      revue.updated.push(new Date().getTime());

      revue.$update(function() {
        $location.path('revues/' + revue._id);
      });
    };

    $scope.loader = true;
    $scope.find = function() {
      Revues.query(function(revues) {
        $scope.revues = revues;
        $scope.loader = false;
      }, function(err) {
        $scope.loader = false;
        message_info('Le serveur à échouer à charger les revues', 'error');
        console.log(err);
      });
    };

    $scope.findOne = function() {
      Revues.get({
        revueId: $stateParams.revueId
      }, function(revue) {
        $scope.revue = revue;
        $scope.nom_revue = revue.nom_revue;
        $scope.ref = revue.ref;
        $scope.numero = revue.numero;
        $scope.hors_serie = revue.hors_serie;
        $scope.title = revue.title;
        $scope.date_acquis = revue.date_acquis;
        $scope.code_barre_recherche = revue.code_barre;
        $scope.resume = revue.resume;
      });

    };

    $scope.listeUsers = function() {
      $scope.findOne();
      if ($scope.global.isAdmin) {
        Users.query(function(users) {
          console.log(users);
          $scope.users = users;
        });
      } else {
        Users.me({
          userId: $scope.global.user._id
        }, function(user) {
          console.log(user);
          $scope.users = user;
          $scope.selectedUser = user;
        });
      }
    };

    $scope.getInfoUser = function() {
      recupActif();
      Revues.get({
        revueId: $stateParams.revueId
      }, function(revue) {
        $scope.revue = revue;
        console.log(revue);
        if (revue.emprunt.user) {
          Users.findById({
            userId: revue.emprunt.user
          }, function(user) {
            $scope.user = user;
          });
        }
      });
    };

    $scope.usersActifs = [];

    function recupActif() {
      Users.query(function(users) {
        $scope.users = users;
        $scope.users.forEach(function(user) {
          if ($scope.checkActif(user)) {
            $scope.usersActifs.push(user);
          }
        });
      });
    }

    $scope.nbAboRevue = 0;

    $scope.checkActif = function(user) {
      var time = 1000 * 60 * 60 * 24;
      var today = new Date();
      var fin_livre_mag_revue = new Date(user.livre_mag_revue);
      var diff_livre_mag_revue = fin_livre_mag_revue.getTime() - today.getTime();
      // var fin_caution = new Date(user.caution);
      // var diff_caution = fin_caution.getTime()- today.getTime();


      if (Math.floor(diff_livre_mag_revue / time) >= -30) {
        $scope.nbAboRevue++;
        return true;
      }
      return false;
    };

    $scope.selectUser = function(user) {
      $scope.selectedUser = user;
      $scope.validerEmprunt();
    };

    $scope.validerEmprunt = function() {
      if (!$scope.selectedUser) {
        message_info('choisissez un utilisateur !', 'error');
        return 1;
      }
      var revue = $scope.revue;
      var user = $scope.selectedUser;
      var newEmprunt;
      revue.emprunt.user = $scope.selectedUser._id;
      revue.emprunt.date_debut = $scope.date;
      revue.emprunt.date_fin = incr_date($scope.date, 'Magazines');
      newEmprunt = {
        id: revue._id,
        date_debut: $scope.date,
        date_fin: incr_date($scope.date, 'Magazines'),
        type: 'Magazines'
      };
      user.emprunt.push(newEmprunt);
      user.$update(function(response) {
        revue.$update(function(response) {
          $location.path('revues/' + response._id);
          $scope.emprunt = false;
          $scope.searchUser = null;
          message_info('Emprunt validé');
          $scope.user = user;
        });
      });
    };

    $scope.rendreRevue = function(revue) {
      var user;
      Users.findById({
        userId: $scope.revue.emprunt.user
      }, function(user_) {
        user = user_;
        revue.historique.push({
          'user': $scope.user._id,
          'date_debut': revue.emprunt.date_debut,
          'date_fin': new Date()
        });
        user.historique.push({
          'media': revue._id,
          'date_debut': revue.emprunt.date_debut,
          'date_fin': new Date()
        });
        revue.emprunt = {
          user: null,
          date_debut: null,
          date_fin: null
        };
        for (var i = 0; i < user.emprunt.length; i++) {
          if (user.emprunt[i].id === $scope.revue._id) {
            user.emprunt.splice(i, 1);
          }
        }
        $scope.error = false;
        user.$update(function(response) {
          revue.$update(function(response) {
            message_info('média rendu avec succès');
            $location.path('revues/' + response._id);
          });
        });
      });
    };

    $scope.date_diff = function(revue) {
      var today = new Date();
      if (!revue.emprunt.date_fin) {
        return 1;
      }
      var fin = new Date(revue.emprunt.date_fin);
      var diff = fin.getTime() - today.getTime();
      diff = Math.floor(diff / (1000 * 60 * 60 * 24));
      var res = {};
      if (diff >= 0) {
        if ($scope.global.isAdmin) {
          res.message = 'Média emprunté par ' + revue.emprunt.user.name + ' Il reste ' + diff + ' jour(s) avant le retour en rayon.';
        } else if ($scope.global.authenticated) {
          res.message = 'Il reste ' + diff + ' jour(s) avant le retour en rayon.';
        }
        res.retard = 0;
      } else {
        if ($scope.global.isAdmin) {
          res.message = 'Média emprunté par ' + revue.emprunt.user.name + ' Il y a ' + diff * -1 + ' jour(s) de retard sur la date de retour prévu.';
        } else if($scope.global.authenticated) {
          res.message = 'Il y a ' + diff * -1 + ' jour(s) de retard sur la date de retour prévu.';
        }
        res.retard = 1;
      }
      return res;
    };

    $scope.Initref = function() {
      Revues.getMaxRef(function(revue) {
        console.log(revue);
        $scope.ref = revue.ref + 1;
      });
    };

    $scope.createAbo = function() {
      $scope.date_renouvellement = new Date(this.date_abo);
      console.log($scope.date_renouvellement);
      // $scope.date_renouvellement.setFullYear($scope.date_renouvellement.getFullYear()+1);
      Revues.createRevues({
        nom: this.nom,
        date_abo: this.date_abo,
        date_renouvellement: $scope.date_renouvellement.setFullYear($scope.date_renouvellement.getFullYear() + 1)
      }, function(pattern_revue) {
        console.log(pattern_revue);
        $scope.liste_revues.push(pattern_revue);
      });
    };
  }
]);