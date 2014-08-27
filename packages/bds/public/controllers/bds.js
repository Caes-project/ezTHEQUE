'use strict';

angular.module('mean.bds').controller('BdsController', ['$scope', '$http', '$cookies', '$timeout', '$stateParams', '$location', 'Users', 'Global', 'Bds', 'Livres',
  function($scope, $http, $cookies, $timeout, $stateParams, $location, Users, Global, Bds, Livres) {
    $scope.global = Global;
    // $scope.users = Users;
    $scope.suppr = false;
    $scope.package = {
      name: 'bds'
    };
    $scope.date = new Date().toISOString().substring(0, 10);

    $scope.genre_liste_bd = ['Aventure', 'Erotique', 'Humour', 'Fantastique', 'Bibliographie', 'Manga', 'Enfants', 'Divers'];
    $scope.searchTags = {
      value: null
    };

    $scope.checkTags = function(media) {
      return $scope.searchTags.value ? $scope.searchTags.value === media.tags : true;
    };

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
          nbjour = $scope.settings.delay_bd;
          break;
      }

      var fin = new Date();
      fin.setDate(today.getDate() + nbjour);
      return fin;
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
        $scope.ref += 1;
        this.resume = '';
        $scope.code_barre_recherche = '';
        $scope.img_google = '';
        $scope.data = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.ajoutImage = function() {
      var formData = new FormData();
      formData.append('file', $scope.image);
      $http({
        method: 'POST',
        url: './uploadImage',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: {
          file: formData
        }
      }).
      then(function(result) {
        console.log(result);
        return result.data;
      });
    };


    $scope.save = function() {
      $scope.suppr = false;
    };

    $scope.save_suppr = function() {
      if ($scope.bd.emprunt.user) {
        $scope.error = true;
      } else {
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

    $scope.loader = true;
    $scope.find = function() {
      Bds.query(function(bds) {
        $scope.bds = bds;
        $scope.loader = false;
      }, function(err) {
        $scope.loader = false;
        message_info('Le serveur à échouer à charger les bds', 'error');
        console.log(err);
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
        $scope.dewey = bd.dewey;
        $scope.date_acquis = bd.date_acquis;
        $scope.code_barre_recherche = bd.code_barre;
        $scope.cote = bd.cote;
        $scope.resume = bd.resume;
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
      Bds.get({
        bdId: $stateParams.bdId
      }, function(bd) {
        $scope.bd = bd;
        console.log(bd);
        if (bd.emprunt.user && $scope.global.isAdmin) {
          Users.findById({
            userId: bd.emprunt.user
          }, function(user) {
            $scope.user = user;
          });
        }
      });
    };

    $scope.usersActifs = [];

    function recupActif() {
      if ($scope.global.isAdmin) {
        Users.query(function(users) {
          $scope.users = users;
          $scope.users.forEach(function(user) {
            if ($scope.checkActif(user)) {
              $scope.usersActifs.push(user);
            }
          });
        });
      }
    }

    $scope.nbAboBD = 0;

    $scope.checkActif = function(user) {
      var time = 1000 * 60 * 60 * 24;
      var today = new Date();
      var fin_livre_mag_bd = new Date(user.livre_mag_revue);
      var diff_livre_mag_bd = fin_livre_mag_bd.getTime() - today.getTime();
      // var fin_caution = new Date(user.caution);
      // var diff_caution = fin_caution.getTime()- today.getTime();

      // if(Math.floor(diff_livre_mag_bd / time) >=-30 && Math.floor(diff_caution / time) >=-30){
      if (Math.floor(diff_livre_mag_bd / time) >= -30) {
        $scope.nbAboBD++;
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
      var bd = $scope.bd;
      var user = $scope.selectedUser;
      var newEmprunt;
      bd.emprunt.user = $scope.selectedUser._id;
      bd.emprunt.date_debut = $scope.date;
      bd.emprunt.date_fin = incr_date($scope.date, 'BD');
      newEmprunt = {
        id: bd._id,
        date_debut: $scope.date,
        date_fin: incr_date($scope.date, 'BD'),
        type: 'BD'
      };
      user.emprunt.push(newEmprunt);
      user.$update(function(response) {
        bd.$update(function(response) {
          $location.path('bds/' + response._id);
          $scope.emprunt = false;
          $scope.searchUser = null;
          message_info('Emprunt validé');
          $scope.user = user;
        });
      });
    };

    $scope.rendreBd = function(bd) {
      var user;
      // console.log($scope.bd.emprunt.user);
      Users.findById({
          userId: $scope.bd.emprunt.user
        },
        function(user_) {
          user = user_;
          bd.historique.push({
            'user': $scope.user._id,
            'date_debut': bd.emprunt.date_debut,
            'date_fin': new Date()
          });
          user.historique.push({
            'media': bd._id,
            'date_debut': bd.emprunt.date_debut,
            'date_fin': new Date()
          });
          bd.emprunt = {
            user: null,
            date_debut: null,
            date_fin: null
          };
          for (var i = 0; i < user.emprunt.length; i++) {
            if (user.emprunt[i].id === $scope.bd._id) {
              user.emprunt.splice(i, 1);
            }
          }
          // console.log(user);
          $scope.error = false;
          user.$update(function(response) {
            bd.$update(function(response) {
              message_info('média rendu avec succès');
              $location.path('bds/' + response._id);
            });
          });
        });
    };

    $scope.recup_google = function() {
      if ($scope.code_barre) {
        $scope.enregistre = false;
        Bds.query({
          'code_barre': $scope.code_barre
        }, function(bd) {
          if (bd[0]) {
            message_info('Vous avez déjà un exemplaire de cette bd enregistré dans la base de données', 'error');
          } else {
            $http.get('https://www.googleapis.com/books/v1/volumes?q=isbn:' + $scope.code_barre).
            success(function(data, status, headers, config) {
              $scope.data = data;
              //si le bd retourné est unique alors on prérempli les champs.
              if (!data.items) {
                message_info('Aucune BD trouvé !', 'error');
                $scope.code_barre = $scope.code_barre;
              } else if (data.items.length === 1) {
                console.log(data.items);
                if (data.items[0].volumeInfo.authors) {
                  $scope.scenariste = data.items[0].volumeInfo.authors[0];
                  if(data.items[0].volumeInfo.authors[1]){
                    $scope.dessinateur = data.items[0].volumeInfo.authors[1];
                  }
                }
                if (data.items[0].volumeInfo.title) {
                  $scope.title = data.items[0].volumeInfo.title;
                }
                if(data.items[0].volumeInfo.subtitle){
                  $scope.title += ' '+ data.items[0].volumeInfo.subtitle;
                }
                $scope.code_barre = $scope.code_barre;
                if (data.items[0].volumeInfo.imageLinks) {
                  $scope.img_google = data.items[0].volumeInfo.imageLinks.thumbnail;
                } else {
                  $http.get('https://www.googleapis.com/books/v1/volumes?q=' + data.items[0].volumeInfo.title + ' ' + data.items[0].volumeInfo.authors[0]).
                  success(function(data, status, headers, config) {
                    if (data.items[0].volumeInfo.imageLinks) {
                      $scope.img_google = data.items[0].volumeInfo.imageLinks.thumbnail;
                    } else {
                      message_info('Aucune couverture dans les données renvoyées par Google', 'error');
                    }
                  });
                }
                $scope.lien_livre = data.items[0].volumeInfo;
                if (data.items[0].volumeInfo.description) {
                  $scope.resume = data.items[0].volumeInfo.description;
                }
                if (data.items[0].volumeInfo.authors[0].split(' ').length > 1) {
                  $scope.cote = data.items[0].volumeInfo.authors[0].split(' ')[1].substring(0, 3).toUpperCase();
                } else {
                  $scope.cote = data.items[0].volumeInfo.authors[0].substring(0, 3).toUpperCase();
                }
              }
            }).error(function(data, status, headers, config) {
              message_info('Il semblerai que la connection vers google_book soit impossible pour le moment ...', 'error');
            });
          }
        });
      } else {
        message_info('Veuillez entrer un code barre');
      }
    };

    $scope.date_diff = function(bd) {
      var today = new Date();
      if (!bd.emprunt.date_fin) {
        return 1;
      }
      var fin = new Date(bd.emprunt.date_fin);
      var diff = fin.getTime() - today.getTime();
      diff = Math.floor(diff / (1000 * 60 * 60 * 24));
      var res = {};
      if (diff >= 0) {
        if ($scope.global.isAdmin) {
          res.message = 'Média emprunté par ' + bd.emprunt.user.name + ' Il reste ' + diff + ' jour(s) avant le retour en rayon.';
        } else if ($scope.global.authenticated) {
          res.message = 'Il reste ' + diff + ' jour(s) avant le retour en rayon.';
        }
        res.retard = 0;
      } else {
        if ($scope.global.isAdmin) {
          res.message = 'Média emprunté par ' + bd.emprunt.user.name + ' Il y a ' + diff * -1 + ' jour(s) de retard sur la date de retour prévu.';
        } else if ($scope.global.authenticated) {
          res.message = 'Il y a ' + diff * -1 + ' jour(s) de retard sur la date de retour prévu.';
        }
        res.retard = 1;
      }
      return res;
    };

    $scope.Initref = function() {
      Bds.getMaxRef(function(bd) {
        console.log(bd);
        $scope.ref = bd.ref + 1;
      });
    };
  }
]);