var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/nodeblog');

var noteSchema = Schema({
    title: String,
    author: {
        first: String,
        last: String
    },
    contents: String,
    slug: String,
    tags: [ObjectId],
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    }
});

var tagSchema = Schema({
    name: String,
    slug: String,
});


function getTag() {
    return mongoose.model('Tag', tagSchema);
}

function getNote() {
    return mongoose.model('Note', noteSchema);
}

module.exports.tag = getTag();
module.exports.note = getNote();
