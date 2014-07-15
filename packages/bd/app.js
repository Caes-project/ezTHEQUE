'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Bd = new Module('bd');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Bd.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Bd.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Bd.menus.add({
        title: 'bd example page',
        link: 'bd example page',
        roles: ['authenticated'],
        menu: 'main'
    });

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Bd.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Bd.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Bd.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return Bd;
});
