/* */
define([
    'backbone',
    'notes/views/note'
    ], function(Backbone, NoteView) {
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
                var noteView = new NoteView();
                noteView.render();
            });

            // Start Backbone History
            Backbone.history.start({pushState:true});
        };

        return {
            initialize: initialize
        };
    }
);
