/* */
define([
    'backbone',
    'notes/views/note',
    'notes/collections/notes',
    ], function(Backbone, NoteView, Notes) {
        var NodeBlogRouter = Backbone.Router.extend({
            routes: {
                ':slug':'noteDetails',
                '*actions':'default'
            }
        });

        var initialize = function() {
            // Initialize Application Router
            var router = new NodeBlogRouter;
            var noteView;

            router.on('route:noteDetails',
                function(slug) {
                    var notesCollection = new Notes();

                    // clears the view
                    if (noteView) {
                        noteView.clear();
                    }

                    noteView = new NoteView({
                        model:notesCollection,
                        el:$('#articles-container')
                    });

                    notesCollection.url = "api/note/" + slug;

                    // Fetch
                    notesCollection.fetch({
                        success: function() {
                            console.log("Fetch Note Collection Successful..");
                        }
                    });
                }
            );

            // Handle Routes
            router.on('route:default',
                function() {
                    var notesCollection = new Notes();

                    // render initial view
                    var noteView = new NoteView({
                        model:notesCollection,
                        el:$('#articles-container')
                    });

                    noteView.on("navigate", function(data){
                        console.log("navigate to " + data);
                        router.navigate(data, {trigger: true});
                    });

                    // Fetcj
                    notesCollection.fetch({
                        success: function() {
                            console.log("Fetch Note Collection Successful..");
                        }
                    });
                }
            );

            // Start Backbone History
            Backbone.history.start({pushState:true});
        };

        return {
            initialize: initialize
        };
    }
);
