var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/nodeblog');

var schemaOptions = {toJSON: {virtuals: true}};

var tagSchema = new Schema({
    name: String,
    slug: String
});

var noteSchema = new Schema({
    title: String,
    author: {
        first: String,
        last: String
    },
    contents: String,
    html: String,
    slug: String,
    tags: [{type: ObjectId, ref: 'Tag'}],
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
}, schemaOptions);

noteSchema.virtual('author_fullname').get(function() {
    return this.author.first + " " + this.author.last;
});

noteSchema.virtual('formatted_date').get(function() {
    var df = moment(this.created).fromNow();
    return df;
});


module.exports.Tag = mongoose.model('Tag', tagSchema);
module.exports.Note = mongoose.model('Note', noteSchema);
