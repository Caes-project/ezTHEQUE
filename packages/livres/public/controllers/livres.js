'use strict';

angular.module('mean').controller('LivresController', ['$scope', '$http', '$cookies', '$timeout', '$stateParams', '$location', 'Users', 'Global', 'Livres',
  function($scope, $http, $cookies, $timeout, $stateParams, $location, Users, Global, Livres) {
    $scope.global = Global;
    $scope.loader = true;
    $scope.suppr = false;
    $scope.package = {
      name: 'livres'
    };
    $scope.date = new Date().toISOString().substring(0, 10);

    $scope.genre_liste_livre = ['Science-fiction', 'Policier', 'Romans français', 'Romans anglais', 'Romans allemands', 'Romans italiens', 'Romans espagnols', 'Romans, divers', 'Documentaire'];

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
        // var transition = document.getElementById('message_info');
        // transition.classList.remove('trans_message');
        // transition.offsetWidth = transition.offsetWidth;
        // transition.classList.add('trans_message');
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

    $scope.hasAuthorization = function(livre) {
      if (!livre) return false;
      return $scope.global.isAdmin;
    };

    $scope.isAdmin = function() {
      return $scope.global.isAdmin;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var livre = new Livres({
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
          },
          historique: []
        });
        console.log(livre);
        livre.$save(function(response) {
          message_info('Livre crée avec succès ! ');
          $scope.enregistre = true;
          $scope.livre = livre;
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
        $scope.date = new Date().toISOString().substring(0, 10);
      } else {
        $scope.submitted = true;
      }
    };

    $scope.save = function() {
      $scope.suppr = false;
    };

    $scope.save_suppr = function() {
      if ($scope.livre.emprunt.user) {
        $scope.error = true;
      } else {
        $scope.suppr = true;
      }
    };

    $scope.remove = function(livre) {
      if (livre) {
        livre.$remove(function(response) {
          $location.path('livres');
        });

        for (var i in $scope.livres) {
          if ($scope.livres[i] === livre) {
            $scope.livres.splice(i, 1);
          }
        }
      } else {
        $scope.livre.$remove(function(response) {
          $location.path('livres');
        });
      }
    };

    $scope.update = function() {
      var livre = $scope.livre;
      if (!livre.updated) {
        livre.updated = [];
      }
      livre.updated.push(new Date().getTime());

      livre.$update(function() {
        $location.path('livres/' + livre._id);
      });
    };

    $scope.find = function() {
      Livres.query(function(livres) {
        $scope.livres = livres;
        $scope.loader = false;
      }, function(err) {
        $scope.loader = false;
        message_info('Le serveur à échouer à charger les livres', 'error');
        console.log(err);
      });
    };

    $scope.findOne = function() {
      Livres.get({
        livreId: $stateParams.livreId
      }, function(livre) {
        $scope.livre = livre;
        $scope.ref = livre.ref;
        $scope.auteur = livre.auteur;
        $scope.title = livre.title;
        $scope.dewey = livre.dewey;
        $scope.date_acquis = livre.date_acquis;
        $scope.code_barre_recherche = livre.code_barre;
        $scope.cote = livre.cote;
        $scope.resume = livre.resume;
      });
    };

    $scope.listeUsers = function() {
      $scope.findOne();
      if ($scope.global.isAdmin) {
        Users.query(function(users) {
          $scope.users = users;
        });
      } else {
        Users.me({
          userId: $scope.global.user._id
        }, function(user) {
          $scope.users = user;
          $scope.selectedUser = user;
        });
      }
    };

    $scope.getInfoUser = function() {
      recupActif();
      Livres.get({
        livreId: $stateParams.livreId
      }, function(livre) {
        $scope.livre = livre;
        console.log(livre);
        if (livre.emprunt.user && $scope.global.isAdmin) {
          Users.findById({
            userId: livre.emprunt.user
          }, function(user) {
            $scope.user = user;
          });
        }
      });
      Livres.getSettings(function(settings) {
        $scope.settings = settings.settings;
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

    $scope.nbAboLivre = 0;

    $scope.checkActif = function(user) {
      var time = 1000 * 60 * 60 * 24;
      var today = new Date();
      var fin_livre_mag_revue = new Date(user.livre_mag_revue);
      var diff_livre_mag_revue = fin_livre_mag_revue.getTime() - today.getTime();
      // var fin_caution = new Date(user.caution);
      // var diff_caution = fin_caution.getTime()- today.getTime();

      // if(Math.floor(diff_livre_mag_revue / time) >=-30 && Math.floor(diff_caution / time) >=-30){
      if (Math.floor(diff_livre_mag_revue / time) >= -30) {
        $scope.nbAboLivre++;
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
      var livre = $scope.livre;
      var user = $scope.selectedUser;
      var newEmprunt;
      livre.emprunt.user = $scope.selectedUser._id;
      livre.emprunt.date_debut = $scope.date;
      livre.emprunt.date_fin = incr_date($scope.date, 'Livres');
      newEmprunt = {
        id: livre._id,
        date_debut: $scope.date,
        date_fin: incr_date($scope.date, 'Livres'),
        type: 'Livres'
      };
      user.emprunt.push(newEmprunt);
      user.$update(function(response) {
        livre.$update(function(response) {
          $location.path('livres/' + response._id);
          $scope.emprunt = false;
          $scope.searchUser = null;
          message_info('Emprunt validé');
          $scope.user = user;
        });
      });
    };

    $scope.rendreLivre = function(livre) {
      var user;
      console.log($scope.livre.emprunt.user);
      Users.findById({
          userId: $scope.livre.emprunt.user
        },
        function(user_) {
          user = user_;
          console.log(user);
          livre.historique.push({
            'user': user._id,
            'date_debut': livre.emprunt.date_debut,
            'date_fin': new Date().toISOString().substring(0, 10)
          });
          user.historique.push({
            'media': livre._id,
            'date_debut': livre.emprunt.date_debut,
            'date_fin': new Date().toISOString().substring(0, 10)
          });
          livre.emprunt = {
            user: null,
            date_debut: null,
            date_fin: null
          };
          for (var i = 0; i < user.emprunt.length; i++) {
            if (user.emprunt[i].id === $scope.livre._id) {
              user.emprunt.splice(i, 1);
            }
          }
          $scope.error = false;
          user.$update(function(response) {
            livre.$update(function(response) {
              message_info('média rendu avec succès');
              $location.path('livres/' + response._id);
            });
          });
        });
    };

    $scope.recup_google = function() {
      if ($scope.code_barre_recherche) {
        $scope.enregistre = false;
        Livres.query({
          'code_barre': $scope.code_barre_recherche
        }, function(livre) {
          if (livre[0]) {
            message_info('Vous avez déjà un exemplaire de ce livre', 'error');
          } else {
            $http.get('https://www.googleapis.com/books/v1/volumes?q=isbn:' + $scope.code_barre_recherche).
            success(function(data, status, headers, config) {
              $scope.data = data;
              //si le livre retourné est unique alors on prérempli les champs.
              if (!data.items) {
                message_info('Aucun livre trouvé !', 'error');
                $scope.code_barre = $scope.code_barre_recherche;
              } else if (data.items.length === 1) {
                if (data.items[0].volumeInfo.authors) {
                  $scope.auteur = data.items[0].volumeInfo.authors[0];
                }
                if (data.items[0].volumeInfo.title) {
                  $scope.title = data.items[0].volumeInfo.title;
                }
                $scope.code_barre = $scope.code_barre_recherche;
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
                if (data.items[0].volumeInfo.authors[0].split(' ')) {
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


    $scope.date_diff = function(livre) {
      var today = new Date();
      if (!livre.emprunt.date_fin) {
        return 1;
      }
      var fin = new Date(livre.emprunt.date_fin);
      var diff = fin.getTime() - today.getTime();
      diff = Math.floor(diff / (1000 * 60 * 60 * 24));
      var res = {};
      if (diff >= 0) {
        if ($scope.global.isAdmin) {
          res.message = 'Média emprunté par ' + livre.emprunt.user.name + ' Il reste ' + diff + ' jour(s) avant le retour en rayon.';
        } else if ($scope.global.authenticated) {
          res.message = 'Il reste ' + diff + ' jour(s) avant le retour en rayon.';
        }
        res.retard = 0;
      } else {
        if ($scope.global.isAdmin) {
          res.message = 'Média emprunté par ' + livre.emprunt.user.name + ' Il y a ' + diff * -1 + ' jour(s) de retard sur la date de retour prévu.';
        } else if ($scope.global.authenticated) {
          res.message = 'Il y a ' + diff * -1 + ' jour(s) de retard sur la date de retour prévu.';
        }
        res.retard = 1;
      }
      return res;
    };

    $scope.Initref = function() {
      Livres.getMaxRef(function(livre) {
        console.log(livre);
        $scope.ref = livre.ref + 1;
      });
      Livres.getSettings(function(settings) {
        $scope.settings = settings.settings;
        // $scope.genre_liste_livre = ['Science-fiction', 'Policier', 'Romans français', 'Romans anglais', 'Romans allemands', 'Romans italiens', 'Romans espagnols', 'Romans, divers', 'Documentaire'];
      });
    };
  }
]);