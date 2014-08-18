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

            beforeEach(function() {
                module('mean');
                module('mean.system');
                module('mean.users');
                module('mean.revues');
                module('mean.bds');
                module('mean.cds');
                module('mean.dvds');
                // module('mean.livres');
            });

            var UsersAdminController,
                scope,
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


            it('Faire un emprunt', inject(function(Livres, Users) {
                
                var putLivreData = function() {
                    return {
                        code_barre : '978120322514014',
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

                // var fin = new Date();
                // fin.setDate(fin.getDate() + 14);
                // var putLivreDataEnd = function() {
                //     return {
                //         code_barre : '978120322514014',
                //         _id: '525a8422f6d0f87f0e407a33',
                //         title: 'An Livre about MEAN',
                //         auteur: 'MEAN rocks!',
                //         ref: 1,
                //         dewey: 808,
                //         date_acquis: '2014-06-03',
                //         emprunt : {'user':'525a8422f6d0f87f0e419933','date_debut': new Date(),'date_fin': fin}
                //     };
                // };

                var putUserData = function(){
                    return {
                        _id: '525a8422f6d0f87f0e419933',
                        name: 'toto',
                        email: 'toto@titi.com',
                        username: 'Titi',
                        hashed_password: '6KaTk74KsUTlwePMHM/wRVEfISeRGcxXAevJanKpzVu7pACKuEolxz68XbLbhR/gHEYTEBUuZBq/9c27MsBMNA==',
                        emprunt: [],
                        caution: '2015-07-10T09:01:40.259Z',
                        livre_mag_revue: '2015-07-10T09:01:40.259Z'
                    };
                };

                // var putUserDataEnd = function(){
                //     return {
                //         _id: '525a8422f6d0f87f0e419933',
                //         name: 'toto',
                //         email: 'toto@titi.com',
                //         username: 'Titi',
                //         hashed_password: '6KaTk74KsUTlwePMHM/wRVEfISeRGcxXAevJanKpzVu7pACKuEolxz68XbLbhR/gHEYTEBUuZBq/9c27MsBMNA==',
                //         emprunt: [{'id':'525a8422f6d0f87f0e407a33','date_debut':'2016-06-10','date_fin':'2016-06-24', 'type' : 'Livres'}],
                //         caution: '2015-07-10T09:01:40.259Z',
                //         livre_mag_revue: '2015-07-10T09:01:40.259Z'
                //     };
                // };

                var livre = new Livres(putLivreData());
                var user = new Users(putUserData());
                scope.test = true;
                // mock livre in scope
                scope.settings = {
                    delay_livre : 14
                };
                
                // console.log(scope.settings);
                scope.newmedia = livre;
                scope.newmedia.typeMedia = 'Livres';
                scope.user = user; 
                scope.date = new Date();

                // test PUT happens correctly
                // $httpBackend.expectPUT(/livres\/([0-9a-fA-F]{24})$/).respond();

                $httpBackend.expectGET(/livres\/Settings/).respond();
                // $httpBackend.expectPUT(/livres\/([0-9a-fA-F]{24})$/, putLivreDataEnd()).respond();
                $httpBackend.expectPUT(/livres\/([0-9a-fA-F]{24})$/).respond();
                $httpBackend.expectPUT(/admin\/users\/([0-9a-fA-F]{24})$/).respond();
                // $httpBackend.expectPUT(/admin\/users\/([0-9a-fA-F]{24})$/, putUserDataEnd()).respond();
                // run controller

                scope.validerEmprunt();
                $httpBackend.flush();
               
                expect(scope.listeEmprunts).toEqualData([
                    livre
                ]);

                expect(scope.derniermedia).toEqualData(livre);
                expect(scope.newmedia).toEqualData(null);
                expect(scope.refMedia).toEqualData(null);

                expect(scope.listeModif).toEqualData([
                    {'title' : livre.title, 'type' : 'new', '_id' : livre._id}
                ]);
                
            }));
        });
    });
})();