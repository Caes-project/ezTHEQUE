'use strict';

angular.module('mean.livres').config(['$stateProvider',
    function($stateProvider) {

    	// Check if the user is connected
        var checkLoggedin = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') $timeout(deferred.resolve);

                // Not Authenticated
                else {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };
    	
        $stateProvider
        .state('livres', {
            url: '/livres/',
            templateUrl: 'livres/views/list.html'
        })
        .state('create livres', {
            url: '/livres/create',
            templateUrl: 'livres/views/create.html',
            resolve: {
                    loggedin: checkLoggedin
                }
        })
        .state('view livres', {
            url: '/livres/list',
            templateUrl: 'livres/views/list.html',
            resolve: {
                    loggedin: checkLoggedin
                }
        })
        .state('livre by id', {
            url: '/livres/:livreId',
            templateUrl: 'livres/views/view.html',
            resolve: {
                loggedin: checkLoggedin
            }
        });
    }
]);
