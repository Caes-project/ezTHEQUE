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
var RevueSchema = new Schema({
	title: {
        type: String,
        required: true
    },
    code_barre: {
        type: String,
        required: true,
        unique : true
    },
    nom_revue : {
        type : String
    },
    numero:{
        type: Number,
        required: true,
        unique : true
    },
    Hors_serie:{
        type: Boolean
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
            ref: 'Revue'
        },
        date_debut: {
            type: Date
        }, 
        date_fin: {
            type: Date
        }
    }],
    tags:{
        type: String,
        required: false
    }

});


/**
 * Methods
 */
RevueSchema.methods = {

   
};

RevueSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};


mongoose.model('Revue', RevueSchema);
