'use strict';

// there has to be a better way to bootstrap package models for mocha tests
require('../../../server/models/livre');

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Livre = mongoose.model('Livre');

//Globals
var user;
var livre;
var livreExistant;
//The tests
describe('<Unit Test>', function() {
    describe('Model Livre:', function() {
        beforeEach(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });

            user.save(function() {
                livre = new Livre({
                    title: 'Livre Title',
                    auteur: 'new Mike',
                    user: user,
                    ref: -1
                });
                livreExistant = new Livre({
                    title: 'Livre Title existant',
                    auteur: 'Mike here',
                    user: user,
                    ref: -666
                });
                livreExistant.save(function(){
                    done();
                });
            });
        });

        describe('Method Save', function() {
            it('should be able to save without problems', function(done) {
                return livre.save(function(err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should be able to show an error when try to save a ref that already exist', function(done) {
                livre.ref = -666;
                return livre.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should be able to show an error when try to save without title', function(done) {
                livre.title = '';

                return livre.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

        });

        afterEach(function(done) {
            livre.remove();
            livreExistant.remove();
            user.remove();
            done();
        });
    });
});
