'use strict';

angular.module('mean.bds').config(['$stateProvider',
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
        .state('bds', {
            url: '/bds/',
            templateUrl: 'bds/views/list.html'
        })
        .state('create bds', {
            url: '/bds/create',
            templateUrl: 'bds/views/create.html',
            resolve: {
                    loggedin: checkAdmin
                }
        })
        .state('view bds', {
            url: '/bds/list',
            templateUrl: 'bds/views/list.html',
            resolve: {
                    loggedin: checkLoggedin
                }
        })
        .state('bd by id', {
            url: '/bds/:bdId',
            templateUrl: 'bds/views/view.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('edit bd', {
            url: '/bds/:bdId/edit',
            templateUrl: 'bds/views/edit.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('emprunter bd', {
            url: '/bds/:bdId/emprunt',
            templateUrl: 'bds/views/emprunter.html',
            resolve: {
                loggedin: checkLoggedin
            }
        });
    }
]);
