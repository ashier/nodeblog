var models = require('./models');

var Note = models.Note;
var Tag = models.Tag;

// index
exports.read = function(req, res) {

    var body = req.body;
    var slug = req.body.slug ? req.body.slug : req.params.slug;

    if (!slug) {
        Note.find()
            .sort({created: -1})
            .select('title tags contents created modified slug')
            .exec(
                function (err, notes) {
                    var response;
                    if (err) {
                        response = {status:"error", message:err};
                    } else {
                        response = notes;
                    }
                    console.log("response :: " + response);
                    res.json(response);
                }
            );
    } else {
        Note.find({slug:req.params.slug})
            .select('title tags contents created modified slug')
            .exec(
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
exports.update = function(req, res) {

    var body = req.body;
    var slug = req.body.slug ? req.body.slug : req.params.slug;
    var tags = body.tags.split(",");

    Note.findOne({slug:slug})
        .select('title tags contents created modified slug')
        .exec(function(err, note) {
            if (err) {
                res.json({status:"error", message:"Note cannot be found."});
            } else {
                note.title = body.title ? body.title : note.title;
                note.contents = body.contents ? body.contents : note.contents;
                note.modified = new Date();

                if (tags) {
                    for(var i = 0; i < tags.length; i++) {
                        console.log(" >> tag >>  " + tags[i]);
                        Tag.findOne({_id: tags[i]})
                            .exec(function(err, tag) {
                                if (!err) {
                                    note.tags.push(tag);
                                }
                            });
                    }
                }

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
exports.create = function(req, res) {

    var body = req.body;
    var tags = body.tags.split(",");

    console.log("body.tags >> " + body.tags);

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

    if (tags) {
        for(var i = 0; i < tags.length; i++) {
            console.log(" >> tag >>  " + tags[i]);
            Tag.findOne({_id: tags[i]})
                .exec(function(err, tag) {
                    if (!err) {
                        note.tags.push(tag);
                    }
                });
        }
    }

    note.save(function(err, note) {
        if (!err) {
             res.json(note);
        }
    });
};

// Delete Note
exports.delete = function(req, res) {

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
