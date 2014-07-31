'use strict';

angular.module('mean.dvds').config(['$stateProvider',
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

        var checkAdmin = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                console.log(user.roles);
                if (user.roles.indexOf('admin') !== -1) $timeout(deferred.resolve);

                // Not Authenticated
                else {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };
    	
        $stateProvider
        .state('dvds', {
            url: '/dvds/',
            templateUrl: 'dvds/views/list.html'
        })
        .state('create dvds', {
            url: '/dvds/create',
            templateUrl: 'dvds/views/create.html',
            resolve: {
                    loggedin: checkAdmin
                }
        })
        .state('view dvds', {
            url: '/dvds/list',
            templateUrl: 'dvds/views/list.html',
            resolve: {
                    loggedin: checkLoggedin
                }
        })
        .state('dvd by id', {
            url: '/dvds/:dvdId',
            templateUrl: 'dvds/views/view.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('edit dvd', {
            url: '/dvds/:dvdId/edit',
            templateUrl: 'dvds/views/edit.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('emprunter dvd', {
            url: '/dvds/:dvdId/emprunt',
            templateUrl: 'dvds/views/emprunter.html',
            resolve: {
                loggedin: checkLoggedin
            }
        });
    }
]);
