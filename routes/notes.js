var models = require('./models');

var Note = models.Note;
var Tag = models.Tag;

var tagSelect = 'name slug';
var noteSelect = 'title tags contents created modified slug';

// index
exports.read = function(req, res) {

    var body = req.body;
    var slug = req.body.slug ? req.body.slug : req.params.slug;

    if (!slug) {
        Note.find()
            .sort({created: -1})
            .select(noteSelect)
            .exec(
                function (err, notes) {
                    if (err) {
                        res.json({status:"error", message:err});
                    } else {
                        Note.find()
                            .populate('tags', tagSelect)
                            .exec(function(err, notes) {
                                if (!err) {
                                    res.json(notes);
                                }
                            }
                        );
                    }
                }
            );
    } else {
        Note.findOne({slug:req.params.slug})
            .select(noteSelect)
            .populate('tags', tagSelect)
            .exec(function(err, note) {
                if (!err) {
                    console.log('Updating note: ' + JSON.stringify(note));
                    res.json(note);
                }
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
        .select(noteSelect)
        .populate('tags', tagSelect)
        .exec(function(err, note) {
            if (err) {
                res.json({status:"error", message:"Note cannot be found."});
            } else {
                note.title = body.title ? body.title : note.title;
                note.contents = body.contents ? body.contents : note.contents;
                note.modified = new Date();

                if (tags) {
                    note.tags = [];
                    for(var i = 0; i < tags.length; i++) {
                        console.log(" >> tag >>  " + tags[i]);
                        Tag.findOne({_id: tags[i]})
                            .exec(function(err, tag) {
                                if (!err) {
                                    note.tags.push(tag);
                                    note.save();
                                }
                            });
                    }
                }

                note.save(function(err, note) {
                    if (err) {
                        res.json({status:"error", message:"Note cannot be updated."});
                    } else {
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
