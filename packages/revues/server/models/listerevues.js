'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Validations
 */
// var validatePresenceOf = function(value) {
//     // If you are authenticating by any of the oauth strategies, don't validate.
//     return (this.prodiver && this.provider !== 'local') || value.length;
// };

/**
 * Revue Schema
 */
var ListeRevuesSchema = new Schema({
	nom : {
        type : String,
        unique : true
    },
    date_abo : {
        type : Date,
    },
    date_renouvellement :{
        type: Date,
    }
});


/**
 * Methods
 */
ListeRevuesSchema.methods = {

   
};

ListeRevuesSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};


mongoose.model('ListeRevues', ListeRevuesSchema);
