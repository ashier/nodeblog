var db = require('./db');

var Note = db.note;

// index
exports.index = function(req, res) {

    var body = req.body;
    var slug = req.body.slug ? req.body.slug : req.params.slug;

    if (!slug) {
        Note.find()
            .sort({created: -1})
            .exec(function (err, notes) {
                var response;
                if (err) {
                    response = {status:"error", message:err};
                } else {
                    response = notes;
                }
                console.log("response :: " + response);
                res.json(response);
            });
    } else {
        Note.find({slug:req.params.slug},
            function(err, note) {
                var response;
                if (err) {
                    response = {status:"error", message:"Note cannot be found."};
                } else {
                    response = note;
                }
                res.json(response);
            }
        );
    }

};

// update
exports.updateNote = function(req, res) {

    var body = req.body;
    var slug = req.body.slug ? req.body.slug : req.params.slug;

    Note.findOne({slug:slug}, function(err, note) {
        if (err) {
            res.json({status:"error", message:"Note cannot be found."});
        } else {
            note.title = body.title ? body.title : note.title;
            note.contents = body.contents ? body.contents : note.contents;

            // should I update slugs? ~ probably not... will see...
            // note.slug = generateSlug(body.title);

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

// Delete Note
exports.deleteNote = function(req, res) {

    console.log(" >> delete >> " + req.params);

    var body = req.body;
    var slug = req.body.slug ? req.body.slug : req.params.slug;

    console.log(" >> slug >> " + slug);

    Note.findOneAndRemove({slug:slug}, function(err, note) {
        if (err) {
            res.json({status:"error", message:"Note cannot be found."});
        } else {
            res.json({status:"ok", message:"Note has been deleted."});
        }
    });
};


generateSlug = function (string) {
    return string.trim().replace(/\s+/g, '-').replace(/[^\w\-]/g, '').toLowerCase();
};
