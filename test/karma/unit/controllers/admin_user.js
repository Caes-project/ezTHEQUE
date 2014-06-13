'use strict';

(function() {
    describe('MEAN controllers', function() {
        describe('UsersAdminController', function() {

            beforeEach(function() {
                this.addMatchers({
                    toEqualData: function(expected) {
                        return angular.equals(this.actual, expected);
                    }
                });
            });

            // Load the controllers module
            beforeEach(module('mean'));

            var scope,
                UsersAdminController,
                $httpBackend,
                $stateParams,
                $location;


             beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

                scope = $rootScope.$new();

                UsersAdminController = $controller('UsersAdminController', {
                    $scope: scope
                });

                $stateParams = _$stateParams_;

                $httpBackend = _$httpBackend_;

                $location = _$location_;
            }));

            it('should expose some global scope', function() {

                expect(scope.global).toBeTruthy();

            });

            it('Faire un emprunt', inject(function(Livres, Users) {

                // fixture rideshare
                var putLivreData = function() {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        title: 'An Livre about MEAN',
                        auteur: 'MEAN rocks!',
                        ref: 1,
                        dewey: 808,
                        date_acquis: '2014-06-03',
                        emprunt : { user: null,
                                    date_debut : null,
                                    date_fin : null}
                    };
                };

                var putLivreDataEnd = function() {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        title: 'An Livre about MEAN',
                        auteur: 'MEAN rocks!',
                        ref: 1,
                        dewey: 808,
                        date_acquis: '2014-06-03',
                        emprunt : {"user":"525a8422f6d0f87f0e419933","date_debut":"2016-06-10","date_fin":"2016-06-24"}
                    };
                };

                var putUserData = function(){
                    return {
                        _id: '525a8422f6d0f87f0e419933',
                        name: 'toto',
                        email: 'toto@titi.com',
                        username: 'Titi',
                        hashed_password: '6KaTk74KsUTlwePMHM/wRVEfISeRGcxXAevJanKpzVu7pACKuEolxz68XbLbhR/gHEYTEBUuZBq/9c27MsBMNA==',
                        emprunt: []
                        };
                };

                var putUserDataEnd = function(){
                    return {
                        _id: '525a8422f6d0f87f0e419933',
                        name: 'toto',
                        email: 'toto@titi.com',
                        username: 'Titi',
                        hashed_password: '6KaTk74KsUTlwePMHM/wRVEfISeRGcxXAevJanKpzVu7pACKuEolxz68XbLbhR/gHEYTEBUuZBq/9c27MsBMNA==',
                        emprunt: [{"id":"525a8422f6d0f87f0e407a33","date_debut":"2016-06-10","date_fin":"2016-06-24"}]
                        };
                };

                // mock livre object from form
                var livre = new Livres(putLivreData());
                var user = new Users(putUserData());
                // mock livre in scope
                scope.newlivre = livre;
                scope.user = user;
                scope.date = '2016-06-10';
                scope.date_fin = '2016-06-24';
                // test PUT happens correctly
                // $httpBackend.expectPUT(/livres\/([0-9a-fA-F]{24})$/).respond();

                $httpBackend.expectPUT(/livres\/([0-9a-fA-F]{24})$/, putLivreDataEnd()).respond();
                $httpBackend.expectPUT(/admin\/users\/([0-9a-fA-F]{24})$/, putUserDataEnd()).respond();
                // run controller

                scope.validerEmprunt();
                $httpBackend.flush();

                // test URL location to new object
                // expect($location.path()).toBe('/admin\/users\/([0-9a-fA-F]{24})$/' + putLivreData()._id);

            }));


            it('rendre un emprunt', inject(function(Livres, Users) {

                // fixture rideshare
                var putLivreData = function() {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        title: 'An Livre about MEAN',
                        auteur: 'MEAN rocks!',
                        ref: 1,
                        dewey: 808,
                        date_acquis: '2014-06-03',
                        emprunt : {"user":"525a8422f6d0f87f0e419933","date_debut":"2016-06-10","date_fin":"2016-06-24"}
                    };
                };

                var putLivreDataEnd = function() {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        title: 'An Livre about MEAN',
                        auteur: 'MEAN rocks!',
                        ref: 1,
                        dewey: 808,
                        date_acquis: '2014-06-03',
                        emprunt : { user: null,
                                    date_debut : null,
                                    date_fin : null}
                    };
                };

                var putUserData = function(){
                    return {
                        _id: '525a8422f6d0f87f0e419933',
                        name: 'toto',
                        email: 'toto@titi.com',
                        username: 'Titi',
                        hashed_password: '6KaTk74KsUTlwePMHM/wRVEfISeRGcxXAevJanKpzVu7pACKuEolxz68XbLbhR/gHEYTEBUuZBq/9c27MsBMNA==',
                        emprunt: [{"id":"525a8422f6d0f87f0e407a33","date_debut":"2016-06-10","date_fin":"2016-06-24"}]
                        };
                };

                var putUserDataEnd = function(){
                    return {
                        _id: '525a8422f6d0f87f0e419933',
                        name: 'toto',
                        email: 'toto@titi.com',
                        username: 'Titi',
                        hashed_password: '6KaTk74KsUTlwePMHM/wRVEfISeRGcxXAevJanKpzVu7pACKuEolxz68XbLbhR/gHEYTEBUuZBq/9c27MsBMNA==',
                        emprunt: []
                        };
                };

                // mock livre object from form
                var livre = new Livres(putLivreData());
                var user = new Users(putUserData());
                // mock livre in scope
                scope.newlivre = livre;
                scope.user = user;
                // test PUT happens correctly
                // $httpBackend.expectPUT(/livres\/([0-9a-fA-F]{24})$/).respond();
                // $httpBackend.expectPOST('livres/upload', postLivreData()).respond(responseLivreData());


                $httpBackend.expectPUT(/admin\/users\/([0-9a-fA-F]{24})$/, putUserDataEnd()).respond();
                $httpBackend.expectPUT(/livres\/([0-9a-fA-F]{24})$/, putLivreDataEnd()).respond();
               
                // run controller
                scope.rendreLivre(livre);
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/livres/' + putLivreData()._id);

            }));


        });
    });
})();