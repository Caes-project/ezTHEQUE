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
 * Dvd Schema
 */
var DvdSchema = new Schema({
	title: {
        type: String,
        required: true
    },
    realisateur: {
        type: String,
        required: false
    },
    acteur: {
        type: String,
        required: false
    },
    annee:{
        type: Number,
        required: false
    },
    duree:{
        type: Number,
        required: false
    },
    code_barre: {
        type: String,
        required: true,
        unique : true
    },
    info: {
        type: String,
        required: false
    },
    emprunt: {
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        date_debut: {
            type: Date,
        }, 
        date_fin: {
            type: Date,
        }
    },
    dewey: {
        type: String,
        required: false
    },
    date_acquis: {
        type: Date,
        required: false
    },
    date_hors_circu: {
        type: Date,
        required: false
    },
    lien_image: {
        type: String,
        required: false
    },
    ref:{
        type: Number,
        required: true,
        unique : true
    },
    ref_adav:{
        type: Number,
        required: false
    },
    historique: [{        
        user: {
            type: Schema.ObjectId,
            ref: 'Dvd'
        },
        date_debut: {
            type: Date
        }, 
        date_fin: {
            type: Date
        }
    }],
    resume:{
        type: String,
        required : false
    }
});


/**
 * Methods
 */
DvdSchema.methods = {

   
};

DvdSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};


mongoose.model('Dvd', DvdSchema);
