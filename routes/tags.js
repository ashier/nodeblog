var db = require('./db');
var Tag = db.tag;

exports.index = function(req, res) {
    Tag.find(function (err, tags) {
        var response;
        if (err) {
            response = {status:"error", message:err};
        } else {
            response = tags;
        }
        res.json(response);
    });
};
