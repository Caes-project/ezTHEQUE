'use strict';

// there has to be a better way to bootstrap package models for mocha tests
require('../models/livre');
require('../../../users/server/models/user');

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    request = require('request'),
    fs = require('fs'),
    Livre = mongoose.model('Livre'),
    User = mongoose.model('User');

//Globals
var user;
var livre;
/**
    Livre emprunté
**/
var livreExistant;
/**
    Livre disponible
**/
var livreExistant2;

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
                    code_barre: '97820706430280',
                    title: 'Livre Title',
                    auteur: 'new Mike',
                    emprunt : {
                        user: user,
                        date_debut : '2014-06-12',
                        date_fin : '2014-06-26'
                    },
                    ref: -1
                });
                livreExistant = new Livre({
                    code_barre: '97820706430260',
                    title: 'Livre Title existant',
                    auteur: 'Mike here',
                    emprunt : {
                        user: user,
                        date_debut : '2014-06-12',
                        date_fin : '2014-06-26'
                    },
                    ref: -666
                });
                livreExistant2 = new Livre({
                    code_barre: '97820706430270',
                    title: 'Livre Title existant2',
                    auteur: 'Mikey here',
                    ref: -667
                });
                livreExistant.save(function(){
                    livreExistant2.save(function(){
                        done();
                    });
                });
            });
        });

        describe('Method Save Livre', function() {
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

        describe('Method read Livre', function(){
            it('should be able to read the begining date of a borrowing', function(done){
                return Livre.find({ref: -666}, function(err, livres){
                    livres.should.have.length(1);
                    should.exist(livres[0].emprunt.date_debut);
                    done();
                });
            });

            it('should be able to read a book without borrowing', function(done){
                Livre.find({ref: -667}, function(err, livres){
                    livres.should.have.length(1);
                    should.not.exist(livres[0].emprunt.user);
                    done();
                });
            });
        });

        describe('Method update Emprunt Livre', function(){
            it('should erase the borrowing and give another one without problems', function(done){
                Livre.update({'ref': -666}, { $set: { 'emprunt.user': null}}, function(err){
                    Livre.find({ref: -666}, function(err, livres){
                        should.not.exist(err);
                        // console.log(livres[0].emprunt);
                        // (livres[0].emprunt.user === null).should.be.true;
                        Livre.update({'ref': -666}, { $set: { 'emprunt.user': user}}, function(err){
                            Livre.find({ref: -666}, function(err, livres){
                               should.exist(livres[0].emprunt.user);
                               done();
                            });
                        });
                    });
                });
            });
        });

        describe('it should connect to google books', function(){
            it('connect to google books api', function(done){
                var targetpath = 'packages/livres/upload/lol.jpg';
                var file = fs.createWriteStream(targetpath);
                var options = {
                    method: 'GET',
                    uri: 'https://www.googleapis.com/books/v1/volumes?q=isbn:9782070643028',
                    headers : {
                        'User-Agent': 'Mozilla/5.0'
                    },
                    jar: true,
                    proxy : process.env.PROXY || null
                };
                request(options)
                .pipe(file)
                .on('error', function (err) {
                    console.log(err);
                    should.not.exist(err);
                    fs.unlink(targetpath);
                    
                }).on('finish', function () {
                    done();
                });
            });
        });

        afterEach(function(done) {
            livre.remove();
            livreExistant.remove();
            livreExistant2.remove();
            user.remove();
            done();
        });
    });
});
