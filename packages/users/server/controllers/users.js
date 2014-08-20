'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 User = mongoose.model('User'),
 Livres = mongoose.model('Livre'),
 Bds = mongoose.model('Bd'),
 Cds = mongoose.model('Cd'),
 Dvds = mongoose.model('Dvd'),
 Revues = mongoose.model('Revue'),
 async = require('async'),
 config = require('meanio').loadConfig(),
 crypto = require('crypto'),
 nodemailer = require('nodemailer'),
 templates = require('../template');

/**
 * Auth callback
 */
 exports.authCallback = function(req, res) {
  res.redirect('/');
};

/**
 * Show login form
 */
 exports.signin = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.redirect('#!/login');
};

/**
 * Logout
 */
 exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Session
 */
 exports.session = function(req, res) {
  res.redirect('/');
};

/**
 * Create user
 */
 exports.create = function(req, res, next) {
  var user = new User(req.body);

  user.provider = 'local';

  // because we set our user.provider to local our models/user.js validation will always be true
  req.assert('name', 'You must enter a name').notEmpty();
  req.assert('email', 'You must enter a valid email address').isEmail();
  req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
  req.assert('username', 'Username cannot be more than 20 characters').len(1, 20);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  // Hard coded for now. Will address this with the user permissions system in v0.3.5
  user.roles = ['authenticated'];
  user.save(function(err) {
    if (err) {
      switch (err.code) {
        case 11000:
        res.status(400).send([{
          msg: 'Email already taken',
          param: 'email'
        }]);
        break;
        case 11001:
        res.status(400).send([{
          msg: 'Username already taken',
          param: 'username'
        }]);
        break;
        default:
        var modelErrors = [];

        if (err.errors) {

          for (var x in err.errors) {
            modelErrors.push({
              param: x,
              msg: err.errors[x].message,
              value: err.errors[x].value
            });
          }

          res.status(400).send(modelErrors);
        }
      }

      return res.status(400);
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
    res.status(200);
  });
};
/**
 * Send User
 */
 exports.me = function(req, res) {
  res.json(req.user || null);
};

function findAndPopulate (user_mail, callback){
  console.log(user_mail);
  User.findOne({
    email : user_mail
  })
  .exec(function(err, user) {
    var listeEmprunts = [];
    var emprunts =  user.emprunt;
    var pushMedia = function(typeMedia, callback2){
      return function(err, media){
        if(err) console.log(err);
        media.typeMedia=typeMedia;
        listeEmprunts.push(media);
        callback2(null);
      };
    };
    function getMedia(emprunt, callback2){
      if(emprunt.type === 'Livres'){
        Livres.findById(
         emprunt.id , pushMedia('Livres', callback2));
      }else if(emprunt.type === 'Magazines'){
        Revues.findById(
          emprunt.id , pushMedia('Magazines', callback2));
      }else if(emprunt.type === 'BD'){
        Bds.findById(
         emprunt.id , pushMedia('BD', callback2));
      }else if(emprunt.type === 'CD'){
        Cds.findById(
         emprunt.id , pushMedia('CD', callback2));
      }else if(emprunt.type === 'DVD'){
        Dvds.findById(
          emprunt.id , pushMedia('DVD', callback2));
      }
    }    
    async.map(emprunts, getMedia, function(err, results){
      if(err) console.log(err);
      callback(err, user, listeEmprunts);
    });  
  });
}
/**
 * Find user by id
 */
 exports.user = function(req, res, next, id) {
  User
  .findOne({
    _id: id
  })
  .exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};

/**
 * Resets the password
 */

 exports.resetpassword = function(req, res, next) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function(err, user) {
    if (err) {
      return res.status(400).json({
        msg: err
      });
    }
    if (!user) {
      return res.status(400).json({
        msg: 'Token invalid or expired'
      });
    }
    req.assert('password', 'Password must be between 8-20 characters long').len(8, 20);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).send(errors);
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save(function(err) {
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.send({
          user: user,
        });
      });
    });
  });
};

/**
 * Send reset password email
 */
 function sendMail(mailOptions) {
  var transport = nodemailer.createTransport('SMTP', config.mailer);
  transport.sendMail(mailOptions, function(err, response) {
    if (err){
      console.log(err);
      return err;
    }
    console.log(response);
    return response;
  });
}

/**
 * Callback for forgot password link
 */
 exports.forgotpassword = function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({
        email: req.body.text
      }, function(err, user) {
        if (err || !user) return done(true);
        done(err, user, token);
      });
    },
    function(user, token, done) {
      user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      },
      function(token, user, done) {
        var mailOptions = {
          to: user.email,
          from: config.emailFrom
        };
        mailOptions = templates.forgot_password_email(user, req, token, mailOptions);
        sendMail(mailOptions);
        done(null, true);
      }
      ],
      function(err, status) {
        var response = {
          message: 'Mail successfully sent',
          status: 'success'
        };
        if (err) {
          response.message = 'User does not exist';
          response.status = 'danger';
        }
        res.json(response);
      }
      );
};

exports.mailRetard = function(req, res, next){
  async.waterfall([
    function(done) {
      findAndPopulate(
        req.body.text , function(err, user, listeEmprunts) {
          if (err || !user) return done(true);
          done(err, user, listeEmprunts);
        });
    },
    function(user, listeEmprunts, done) {
      var mailOptions = {
        to: user.email,
        from: config.emailFrom
      };
      mailOptions = templates.prevenir_retard(user, req,  mailOptions, listeEmprunts);
      sendMail(mailOptions);
      done(null, true);
    }
    ],
    function(err, status) {
      var response = {
        message: 'Mail successfully sent',
        status: 'success'
      };
      if (err) {
        response.message = 'User does not exist';
        response.status = 'danger';
      }
      res.json(response);
    }
    );
};