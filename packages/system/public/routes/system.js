'use strict';

//Setting up route
angular.module('mean.system').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/');
    var checkAdmin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
          // Authenticated
          // console.log(user.roles);
          if (user.roles.indexOf('admin') !== -1) $timeout(deferred.resolve);

          // Not Authenticated
          else {
            $timeout(deferred.reject);
            $location.url('/login');
          }
        });

      return deferred.promise;
    };

  // states for my app
  $stateProvider              
  .state('home', {
    url: '/',
    templateUrl: 'system/views/index.html'
  })
  .state('admin user', {
    url: '/admin/users/:userId',
    templateUrl: 'system/views/admin_user.html',
    resolve: {
      loggedin: checkAdmin
    }
  });
}
]).config(['$locationProvider',
function($locationProvider) {
  $locationProvider.hashPrefix('!');
}
]);
