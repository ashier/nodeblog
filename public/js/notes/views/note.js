/* */
define([
    'backbone'
    ], function(Backbone) {

        var NoteView = Backbone.View.extend({

            events:{
                'click .btn':'getDetails'
            },

            initialize: function() {
                console.log("NoteView Initialized...", this.model);
                this.listenTo(this.model, 'sync', this.render);
            },

            render: function() {
                var templateHTML = _.template($('#note-template').html(), {notes:this.model.toJSON()});
                console.log("templateHTML > " + templateHTML);
                this.$el.html(templateHTML);
                return this;
            },

            getDetails: function(event) {
                var target = event.target;
                var data = $(target).attr("article-data");
                this.trigger("navigate", data);
            },

            clear: function() {
                this.$el.empty();
            }

        });

        return NoteView;
    }
);
