
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

// notes CRUD
app.post('/api/note', notes.create);
app.get('/api/note', notes.read);
app.put('/api/note/', notes.update);
app.delete('/api/note/', notes.delete);

// by slug
app.get('/api/note/:slug', notes.read);
app.put('/api/note/:slug', notes.update);
app.delete('/api/note/:slug', notes.delete);

// tags CRUD
app.get('/api/tag', tags.read);
app.post('/api/tag', tags.create);
// app.put('/api/note/', tags.update);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
