'use strict';

angular.module('mean.cds').config(['$stateProvider',
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
        .state('cds', {
            url: '/cds/',
            templateUrl: 'cds/views/list.html'
        })
        .state('create cds', {
            url: '/cds/create',
            templateUrl: 'cds/views/create.html',
            resolve: {
                    loggedin: checkAdmin
                }
        })
        .state('view cds', {
            url: '/cds/list',
            templateUrl: 'cds/views/list.html',
            resolve: {
                    loggedin: checkLoggedin
                }
        })
        .state('cd by id', {
            url: '/cds/:cdId',
            templateUrl: 'cds/views/view.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('edit cd', {
            url: '/cds/:cdId/edit',
            templateUrl: 'cds/views/edit.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('emprunter cd', {
            url: '/cds/:cdId/emprunt',
            templateUrl: 'cds/views/emprunter.html',
            resolve: {
                loggedin: checkLoggedin
            }
        });
    }
]);
