
/**/
requirejs.config({
    baseUrl:'/static/js',
    paths:{
        jquery:'vendor/jquery',
        underscore:'vendor/underscore',
        backbone:'vendor/backbone'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require([
    'notes'
    ], function(App) {
        console.log("Notes Application Initialized...");
        App.initialize();
    }
);
