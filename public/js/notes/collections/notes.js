/* */
define([
    'backbone',
    '/notes/models/note'
    ], function(Backbone, Note) {

        var Notes = Backbone.Collection.extend({
            model:Note
        });

        return Notes;
    }
);
