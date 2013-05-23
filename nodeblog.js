
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    notes = require('./routes/notes'),
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

app.get('/note', notes.index);
app.get('/note/:slug', notes.noteBySlug);
app.post('/note', notes.addNote);
app.put('/note/', notes.updateNote);
app.delete('/note/', notes.deleteNote)

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
