/* */
define([
    'backbone'
    ], function(Backbone) {

        var NoteView = Backbone.View.extend({
            el:$('#articles-container'),
            tagName:"article",
            render: function(){

            }
        });

        return NoteView;
    }
);
