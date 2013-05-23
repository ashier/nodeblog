/* */
define([
    'backbone'
    ], function(Backbone) {
        var NodeBlogRouter = Backbone.Router.extend({
            routes: {
                '':'notes'
            }
        });

        var initialize = function() {
            // Initialize Application Router
            var router = new NodeBlogRouter;

            // Handle Routes
            router.on('route:notes', function() {
                console.log('notes called');
            });

            // Start Backbone History
            // Backbone.history = Backbone.history || new Backbone.History({});
            Backbone.history.start({pushState:true});
        };

        return {
            initialize: initialize
        };
    }
);
