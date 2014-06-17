'use strict';

module.exports = {
    db: 'mongodb://localhost/mean-prod',
    app: {
        name: 'ezThèque caes 54'
    },
    facebook: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
        clientID: '856357196278-17ttmtm09rp2dooc8mmr788br2o7tt88.apps.googleusercontent.com',
        clientSecret: 'nf7xPcB7vrgWyY3T2N5-tHrN',
        callbackURL: 'http://nancy.caes.cnrs.fr:50010/auth/google/callback'
    },
    linkedin: {
        clientID: 'API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    }
};
