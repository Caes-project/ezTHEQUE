'use strict';

angular.module('mean.system').controller('HistoriqueController', ['$scope', '$stateParams', '$location', '$timeout', 'Users', 'Global', 'Livres', 'Revues', 'Cds', 'Dvds', 'Bds', '$filter', '$http',
  function($scope, $stateParams, $location, $timeout, Users, Global, Livres, Revues, Cds, Dvds, Bds, $filter, $http) {

    $scope.global = Global;

    $scope.listeHistorique = [];

    $scope.getHistorique = function() {
      $scope.nbLivres = $scope.nbMag = $scope.nbBD = $scope.nbCD = $scope.nbDVD = 0;
      var callbackMedia = function(type, emprunt) {
        return function(media) {
          media.typeMedia = type;
          media.histo= {
            date_debut : emprunt.date_debut,
            date_fin : emprunt.date_fin
          };
          $scope.listeHistorique.push(media);
        };
      };
      //récupère la liste des id des medias emprunté
      $scope.user.historique.forEach(function(emprunt) {
        if (emprunt.type === 'Livres') {
          Livres.get({
            livreId: emprunt.media
          }, callbackMedia('Livres', emprunt));
        } else if (emprunt.type === 'Magazines') {
          Revues.get({
            revueId: emprunt.media
          }, callbackMedia('Magazines', emprunt));
        } else if (emprunt.type === 'BD') {
          Bds.get({
            bdId: emprunt.media
          }, callbackMedia('BD', emprunt));
        } else if (emprunt.type === 'CD') {
          Cds.get({
            cdId: emprunt.media
          }, callbackMedia('CD', emprunt));
        } else if (emprunt.type === 'DVD') {
          Dvds.get({
            dvdId: emprunt.media
          }, callbackMedia('DVD', emprunt));
        }
      });
    };

    Users.findById({
      userId: $stateParams.userId
    }, function(user) {
      console.log(user);
      $scope.user = user;
      $scope.getHistorique();
    });

  }
]);