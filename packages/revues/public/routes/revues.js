'use strict';

angular.module('mean.revues').config(['$stateProvider',
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
        .state('revues', {
            url: '/revues/',
            templateUrl: 'revues/views/list.html'
        })
        .state('create revues', {
            url: '/revues/create',
            templateUrl: 'revues/views/create.html',
            resolve: {
                    loggedin: checkAdmin
                }
        })
        .state('view revues', {
            url: '/revues/list',
            templateUrl: 'revues/views/list.html',
            resolve: {
                    loggedin: checkLoggedin
                }
        })
        .state('revue by id', {
            url: '/revues/:revueId',
            templateUrl: 'revues/views/view.html'
        })
        .state('edit revue', {
            url: '/revues/:revueId/edit',
            templateUrl: 'revues/views/edit.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('emprunter revue', {
            url: '/revues/:revueId/emprunt',
            templateUrl: 'revues/views/emprunter.html',
            resolve: {
                loggedin: checkLoggedin
            }
        });
    }
]);
