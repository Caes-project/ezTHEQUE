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
 * Cd Schema
 */
var CdSchema = new Schema({
		title: {
        type: String,
        required: true
    },
    auteur: {
        type: String,
        required: false
    },
    editeur: {
        type: String,
        required: false
    },
    interpretes: {
        type: String,
        required: true,
        unique : true
    },
		code_barre: {
        type: String,
        required: true,
        unique : true
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
    historique: [{        
        user: {
            type: Schema.ObjectId,
            ref: 'Cd'
        },
        date_debut: {
            type: Date
        }, 
        date_fin: {
            type: Date
        }
    }],
    rayonnage: {
        type: String,
        required : false
    }
});


/**
 * Methods
 */
CdSchema.methods = {

   
};

CdSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};


mongoose.model('Cd', CdSchema);
