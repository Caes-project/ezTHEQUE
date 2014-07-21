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
 * Bd Schema
 */
var BdSchema = new Schema({
	title: {
        type: String,
        required: true
    },
    scenariste: {
        type: String,
        required: false
    },
    dessinateur: {
        type: String,
        required: false
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
            ref: 'Bd'
        },
        date_debut: {
            type: Date
        }, 
        date_fin: {
            type: Date
        }
    }],
    cote: {
        type: String,
        required : false
    },
    resume:{
        type: String,
        required : false
    },
    tags:{
        type: String,
        required: false
    }

});


/**
 * Methods
 */
BdSchema.methods = {

   
};

BdSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};


mongoose.model('Bd', BdSchema);
