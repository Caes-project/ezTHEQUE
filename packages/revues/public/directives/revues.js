'use strict';

angular.module('mean.revues').directive('ezDatepicker', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.datetimepicker({
             lang:'fr',
             i18n:{
              fr:{
               months:[
                'Janvier','Fevrier','Mars','Avril',
                'Mai','Juin','Juiller','Aout',
                'Septembre','Octobre','Novembre','Decembre',
               ],
               dayOfWeek:[
                'Dim.', 'Lun', 'Mar', 'Mer', 
                'Jeu', 'Ven', 'Sam',
               ]
              }
             },
             timepicker:false,
             format:'Y-M'
            });
        }
    };
});

