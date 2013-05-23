var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeblog');

var noteSchema = mongoose.Schema({
    title: String,
    author: {
        first: String,
        last: String
    },
    contents: String,
    slug: String,
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    }
});

var Note = mongoose.model('Note', noteSchema);
// var notes = require('./db');

exports.index = function(req, res) {
    Note.find(function (err, notes) {
        var response;
        if (err) {
            response = {status:"error", message:err};
        } else {
            response = notes;
        }
        console.log("response :: " + response);
        res.json(response);
    });
};

exports.noteBySlug = function(req, res) {
    console.log("request slug:: " + req.params.slug);
    Note.find({slug:req.params.slug}, function(err, note) {
        var response;
        if (err) {
            response = {status:"error", message:"Note cannot be found."};
        } else {
            response = note;
        }
        res.json(response);
    });
};

// update
exports.updateNote = function(req, res) {
    var body = req.body;
    Note.findOne({slug:body.slug}, function(err, note) {
        if (err) {
            res.json({status:"error", message:"Note cannot be found."});
        } else {
            note.title = body.title ? body.title : note.title;
            note.contents = body.contents ? body.contents : note.contents;
            note.slug = generateSlug(body.title);
            note.modified = new Date();
            note.save(function(err, note) {
                console.log('Updating note: ' + JSON.stringify(note));
                if (err) {
                    res.json({status:"error", message:"Note cannot be updated."});
                } else {
                    console.log("Note has been updated...");
                    res.json(note);
                }
            });
        }
    });
};


// Populate
exports.addNote = function(req, res) {
    var body = req.body;
    console.log('Adding note: ' + JSON.stringify(body));
    var note = new Note({
        title:body.title,
        author: {
            first:"Ashier",
            last:"de Leon"
        },
        slug:generateSlug(body.title),
        contents:body.contents,
        created:new Date(),
        modified:new Date()
    });

    note.save(function(err, note) {
        if (!err) {
             res.json(note);
        }
    });
};

generateSlug = function (string) {
    return string.trim().replace(/\s+/g, '-').replace(/[^\w\-]/g, '').toLowerCase();
};
