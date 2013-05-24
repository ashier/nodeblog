
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    notes = require('./routes/notes'),
    tags = require('./routes/tags'),
    http = require('http');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser());
app.set("view options", {layout: false});
app.use('/static', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.get('/', function(req, res) {
    res.render('/views/index.html');
});

// notes
app.get('/api/note', notes.index);
app.get('/api/note/:slug', notes.noteBySlug);
app.post('/api/note', notes.addNote);
app.put('/api/note/', notes.updateNote);
app.delete('/api/note/', notes.deleteNote);

// tags
app.get('/api/tag', tags.index);
app.post('/api/tag', tags.addTag);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
