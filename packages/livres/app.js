'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Livres = new Module('Livres');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Livres.register(function(app, auth, database) {



    //We enable routing. By default the Package Object is passed to the routes
    Livres.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Livres.menus.add({
        title: 'Livres',
        link: 'livres',
        menu: 'main'
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Livres.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Livres.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Livres.settings(function(err, settings) {
        //you now have the settings object
    });
    */
    Livres.aggregateAsset('css', 'livres.css');

    return Livres;
});
