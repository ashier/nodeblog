var models = require('./models'),
    markdown = require( "markdown" ).markdown,
    tagSelect = 'name slug',
    noteSelect = 'title tags contents html created modified slug',
    Note = models.Note,
    Tag = models.Tag;


// index
exports.read = function(req, res) {

    var body = req.body;
    var slug = req.body.slug ? req.body.slug : req.params.slug;

    if (!slug) {
        Note.find()
            .select(noteSelect)
            .sort('-created')
            .populate('tags', tagSelect)
            .exec(function(err, notes) {
                if (!err) {
                    res.json(notes);
                } else {
                    res.json({status:"error", message:err});
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
    var tags = body.tags ? body.tags.split(",") : null;

    Note.findOne({slug:slug})
        .select(noteSelect)
        .populate('tags', tagSelect)
        .exec(function(err, note) {
            if (err) {
                res.json({status:"error", message:"Note cannot be found."});
            } else {
                note.title = ((body.title !== undefined) ? body.title : note.title) || note.title;
                note.contents = ((body.contents !== undefined) ? body.contents : note.contents) || note.contents;
                note.html = markdown.toHTML(note.contents);
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
    var tags = body.tags ? body.tags.split(",") : null;

    console.log("body.tags >> " + body.tags);

    var note = new Note({
        title:body.title,
        author: {
            first:"Ashier",
            last:"de Leon"
        },
        slug:generateSlug(body.title),
        contents:body.contents,
        html:markdown.toHTML(body.contents),
        created:new Date(),
        modified:new Date()
    });

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
        if (!err) {
            Note.findOne({_id:note._id})
                .populate('tags')
                .exec(function(err, note) {
                    if (!err) {
                        res.json(note);
                    }
                });
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
