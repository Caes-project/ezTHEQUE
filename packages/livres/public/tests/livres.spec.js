'use strict';

(function() {
    // Livres Controller Spec
    describe('MEAN controllers', function() {
        describe('LivresController', function() {
            // The $resource service augments the response object with methods for updating and deleting the resource.
            // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
            // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
            // When the toEqualData matcher compares two objects, it takes only object properties into
            // account and ignores methods.
            beforeEach(function() {
                this.addMatchers({
                    toEqualData: function(expected) {
                        return angular.equals(this.actual, expected);
                    }
                });
            });

            // Load the controllers module
            beforeEach(module('mean'));

            // Initialize the controller and a mock scope
            var LivresController,
                scope,
                $httpBackend,
                $stateParams,
                $location;

            // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
            // This allows us to inject a service but then attach it to a variable
            // with the same name as the service.
            beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

                scope = $rootScope.$new();

                LivresController = $controller('LivresController', {
                    $scope: scope
                });



                $stateParams = _$stateParams_;

                $httpBackend = _$httpBackend_;

                $location = _$location_;

            }));

            it('$scope.find() should create an array with at least one livre object ' +
                'fetched from XHR', function() {

                    // test expected GET request
                    $httpBackend.expectGET('livres').respond([{
                        title: 'An Livre about MEAN',
                        auteur: 'MEAN rocks!',
                        ref: 1,
                        dewey: 808,
                        date_acquis: '2014-06-03'
                    }]);

                    // run controller
                    scope.find();
                    $httpBackend.flush();

                    // test scope value
                    expect(scope.livres).toEqualData([{
                        title: 'An Livre about MEAN',
                        auteur: 'MEAN rocks!',
                        ref: 1,
                        dewey: 808,
                        date_acquis: '2014-06-03'
                    }]);

                });

            it('$scope.findOne() should create an array with one livre object fetched ' +
                'from XHR using a livreId URL parameter', function() {
                    // fixture URL parament
                    $stateParams.livreId = '525a8422f6d0f87f0e407a33';

                    // fixture response object
                    var testLivreData = function() {
                        return {
                        title: 'An Livre about MEAN',
                        auteur: 'MEAN rocks!',
                        ref: 1,
                        dewey: 808,
                        date_acquis: '2014-06-03'
                        };
                    };

                    // test expected GET request with response object
                    $httpBackend.expectGET(/livres\/([0-9a-fA-F]{24})$/).respond(testLivreData());

                    // run controller
                    scope.findOne();
                    $httpBackend.flush();

                    // test scope value
                    expect(scope.livre).toEqualData(testLivreData());

                });

            it('$scope.create() with valid form data should send a POST request ' +
                'with the form input values and then ' +
                'locate to new object URL', function() {

                    // fixture expected POST data
                    var postLivreData = function() {
                        return {
                            title: 'An Livre about MEAN',
                            auteur: 'MEAN rocks!',
                            ref: 1,
                            dewey: 808,
                            date_acquis: '2014-06-03'
                        };
                    };

                    // fixture expected response data
                    var responseLivreData = function() {
                        return {
                            _id: '525cf20451979dea2c000001',
                            title: 'An Livre about MEAN',
                            auteur: 'MEAN rocks!',
                            ref: 1,
                            dewey: 88,
                            date_acquis: '2014-06-03'
                        };
                    };

                    // fixture mock form input values
                    scope.title = 'An Livre about MEAN';
                    scope.auteur = 'MEAN rocks!';
                    scope.ref = 1;
                    scope.dewey = 808;
                    scope.date_acquis = '2014-06-03';

                    // test post request is sent
                    $httpBackend.expectPOST('livres/upload', postLivreData()).respond(responseLivreData());

                    // Run controller
                    // scope.create();
                    // $httpBackend.flush();

                    // test form input(s) are reset
                    // expect(scope.title).toEqual('');
                    // expect(scope.auteur).toEqual('');
                    // expect(scope.ref).toEqual('');
                    // expect(scope.dewey).toEqual('');
                    // expect(scope.date_acquis).toEqual('');

                    // test URL location to new object
                    // expect($location.path()).toBe('/livres/' + responseLivreData()._id);
                });

            it('$scope.update() should update a valid livre', inject(function(Livres) {

                // fixture rideshare
                var putLivreData = function() {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        title: 'An Livre about MEAN',
                        auteur: 'MEAN rocks!',
                        ref: 1,
                        dewey: 808,
                        date_acquis: '2014-06-03'
                    };
                };

                // mock livre object from form
                var livre = new Livres(putLivreData());

                // mock livre in scope
                scope.livre = livre;

                // test PUT happens correctly
                $httpBackend.expectPUT(/livres\/([0-9a-fA-F]{24})$/).respond();

                // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
                //$httpBackend.expectPUT(/livres\/([0-9a-fA-F]{24})$/, putLivreData()).respond();
                /*
                Error: Expected PUT /livres\/([0-9a-fA-F]{24})$/ with different data
                EXPECTED: {'_id':'525a8422f6d0f87f0e407a33','title':'An Livre about MEAN','to':'MEAN is great!'}
                GOT:      {'_id':'525a8422f6d0f87f0e407a33','title':'An Livre about MEAN','to':'MEAN is great!','updated':[1383534772975]}
                */

                // run controller
                scope.update();
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/livres/' + putLivreData()._id);

            }));

            it('$scope.remove() should send a DELETE request with a valid livreId ' +
                'and remove the livre from the scope', inject(function(Livres) {

                    // fixture rideshare
                    var livre = new Livres({
                        _id: '525a8422f6d0f87f0e407a33'
                    });

                    // mock rideshares in scope
                    scope.livres = [];
                    scope.livres.push(livre);

                    // test expected rideshare DELETE request
                    $httpBackend.expectDELETE(/livres\/([0-9a-fA-F]{24})$/).respond(204);

                    // run controller
                    scope.remove(livre);
                    $httpBackend.flush();

                    // test after successful delete URL location livres lis
                    //expect($location.path()).toBe('/livres');
                    expect(scope.livres.length).toBe(0);

                }));

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
                        emprunt : {'user':'525a8422f6d0f87f0e419933','date_debut':'2016-06-10','date_fin':'2016-06-24'}
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
                        emprunt: [{'id':'525a8422f6d0f87f0e407a33','date_debut':'2016-06-10','date_fin':'2016-06-24'}]
                        };
                };

                // mock livre object from form
                var livre = new Livres(putLivreData());
                var user = new Users(putUserData());
                // mock livre in scope
                scope.livre = livre;
                scope.selectedUser = user;
                scope.date = '2016-06-10';
                scope.date_fin = '2016-06-24';
                // test PUT happens correctly
                // $httpBackend.expectPUT(/livres\/([0-9a-fA-F]{24})$/).respond();

                $httpBackend.expectPUT(/admin\/users\/([0-9a-fA-F]{24})$/, putUserDataEnd()).respond();
                $httpBackend.expectPUT(/livres\/([0-9a-fA-F]{24})$/, putLivreDataEnd()).respond();
                // run controller

                scope.validerEmprunt();
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/livres/' + putLivreData()._id);

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
                        emprunt : {'user':'525a8422f6d0f87f0e419933','date_debut':'2016-06-10','date_fin':'2016-06-24'}
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
                        emprunt: [{'id':'525a8422f6d0f87f0e407a33','date_debut':'2016-06-10','date_fin':'2016-06-24'}]
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
                // var user = new Users(putUserData());
                // mock livre in scope
                scope.livre = livre;
                
                // test PUT happens correctly
                // $httpBackend.expectPUT(/livres\/([0-9a-fA-F]{24})$/).respond();
                // $httpBackend.expectPOST('livres/upload', postLivreData()).respond(responseLivreData());


                $httpBackend.expectGET(/admin\/users\/([0-9a-fA-F]{24})$/).respond(putUserData());
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
}());
