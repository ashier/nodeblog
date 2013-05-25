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
                _.templateSettings = {interpolate : /\{\{([\s\S]+?)\}\}/g};
                var templateHTML = $('#note-template').html();
                var html = "";
                _.each(this.model.toJSON(), function(note) {
                    var df = new Date(Date.parse(note.created));
                    note.formattedDate = df.toLocaleString();
                    console.log("tags in view : " + note.tags);
                    _.each(note.tags, function(tag) {
                        console.log("tag in view : " + tag);
                    });
                    html += _.template(templateHTML, note);
                });
                this.$el.html(html);
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
