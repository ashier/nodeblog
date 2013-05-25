var models = require('./models');
var Tag = models.Tag;

exports.read = function(req, res) {
    Tag.find()
        .sort({name: 1})
        .exec(function (err, tags) {
            var response;
            if (err) {
                response = {status:"error", message:err};
            } else {
                response = tags;
            }
            res.json(response);
        });
};

exports.create = function(req, res) {
    var body = req.body;
    console.log('Adding tag: ' + JSON.stringify(body));
    var tag = new Tag({
        name:body.name,
        slug:generateSlug(body.name)
    });

    tag.save(function(err, tag) {
        if (!err) {
             res.json(tag);
        }
    });
};

generateSlug = function (string) {
    return string.trim().replace(/\s+/g, '-').replace(/[^\w\-]/g, '').toLowerCase();
};
