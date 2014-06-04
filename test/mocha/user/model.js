'use strict';

// there has to be a better way to bootstrap package models for mocha tests
require('../../../packages/livres/server/models/livre');

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Livre = mongoose.model('Livre');


//Globals
var user, user2;
var livre;
//The tests
describe('<Unit Test>', function() {
    describe('Model User:', function() {
        before(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password',
                provider: 'local'
            });
            user2 = new User(user);
            livre = new Livre({
                title: 'Livre Title existant',
                auteur: 'Mike here',
                emprunt : {
                    user: user,
                    date_debut : '2014-06-12',
                    date_fin : '2014-06-26'
                },
                ref: -666
            });
            livre.save(function(){
                done();
            });
        });

        describe('Method Save', function() {
            it('should begin without the test user', function(done) {
                User.find({ email: 'test@test.com' }, function(err, users) {
                    users.should.have.length(0);
                    done();
                });
            });

            it('should be able to save without problems', function(done) {
                user.save(done);
            });

            it('should fail to save an existing user again', function(done) {
                user.save();
                return user2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should show an error when try to save without name', function(done) {
                user.name = '';
                return user.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        /**
            Ajoute un enregistrement de prêt puis test si l'enregistrement est bien mis à jour.
        **/
        describe('Method Update', function(){
            it('should add a borrowing to the current user', function(done){
                User.update({email: 'test@test.com'}, {
                    $push: {
                        emprunt :{ 
                            id : livre,
                            date_debut : '2014-06-12',
                            date_fin : '2014-06-27'
                        }
                    }
                }, function(err){
                    console.log(err);
                    User.find({email: 'test@test.com'},function(err, users){
                        should.exist(users[0].emprunt.id);
                        done();
                    });
                });
            });
        });

        after(function(done) {
            user.remove();
            livre.remove();
            done();
        });
    });
});
