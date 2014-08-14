'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

/**
 * Validations
 */
var validatePresenceOf = function(value) {
  // If you are authenticating by any of the oauth strategies, don't validate.
  return (this.provider && this.provider !== 'local') || (value && value.length);
};

var validateUniqueEmail = function(value, callback) {
  var User = mongoose.model('User');
  User.find({
    $and: [{
      email: value
    }, {
      _id: {
        $ne: this._id
      }
    }]
  }, function(err, user) {
    callback(err || user.length === 0);
  });
};

var validateUniqueUsername = function(value, callback) {
  var User = mongoose.model('User');
  User.find({
    $and: [{
      username: value
    }, {
      _id: {
        $ne: this._id
      }
    }]
  }, function(err, user) {
    callback(err || user.length === 0);
  });
};

/**
 * User Schema
 */

var UserSchema = new Schema({
  name: {
      type: String,
      required: true,
      validate: [validatePresenceOf, 'Le nom doit être renseigné']
  },
  email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Entrez une adresse mail valide'],
      validate: [validateUniqueEmail, 'E-mail est déjà utilisé']
  },
  username: {
      type: String,
      unique: true,
      // validate: [validatePresenceOf, 'Username doit être renseigné']
      validate: [validateUniqueUsername, 'Username est déjà présent']
  },
  roles: {
      type: Array,
      default: ['authenticated']
  },
  hashed_password: {
      type: String,
      validate: [validatePresenceOf, 'Password cannot be blank']
  },
  provider: {
      type: String,
      default: 'local'
  },
  id_user :{
      type: Number
  },
  emprunt: [{
    id: {
      type: Schema.ObjectId
    },
    date_debut: {
      type: Date
    }, 
    date_fin: {
      type: Date
    },
    type: {
      type: String
    }
  }],
  livre_mag_revue : {
    type: Date
  },
  DVD : {
    type: Date
  },
  CD : {
    type: Date
  },
  paiement : {
    type: Date
  },
  caution : {
    type: Date
  },
  montant_caution : {
    type :Number
  },
  montant_paiement : {
    type : Number
  },
  historique: [{        
      media: {
          type: Schema.ObjectId
      },
      date_debut: {
          type: Date
      }, 
      date_fin: {
          type: Date
      }
  }],
  date_maj : {
      type: Date,
      default : new Date()
  },
  salt: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  facebook: {},
  twitter: {},
  github: {},
  google: {},
  linkedin: {}
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.hashPassword(password);
}).get(function() {
  return this._password;
});

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
  if (this.isNew && this.provider === 'local' && this.password && !this.password.length)
    return next(new Error('Invalid password'));
  next();
});

UserSchema.pre('save', function(next) {
  this.date_maj = new Date();
  next();
});

/**
 * Methods
 */
UserSchema.methods = {

  /**
   * HasRole - check if the user has required role
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  hasRole: function(role) {
    var roles = this.roles;
    return roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1;
  },

  /**
   * IsAdmin - check if the user is an administrator
   *
   * @return {Boolean}
   * @api public
   */
  isAdmin: function() {
    return this.roles.indexOf('admin') !== -1;
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.hashPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Hash password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  hashPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

mongoose.model('User', UserSchema);
