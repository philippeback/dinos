
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
//  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

var app = express();

var masterUser = 'admin'
      , masterPass = 'control';

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

//ejs.open = '{{';
//ejs.close = '}}';

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Authentication
var auth = express.basicAuth(masterUser, masterPass);
 
// Authentication
var auth = express.basicAuth(masterUser, masterPass);
 
app.get('/admin', auth, function(req, res){
  res.sendfile(__dirname + '/views/admin.html');
});

app.get('/', function(req, res){
  res.sendfile(__dirname + '/views/index.html');
});

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var srv = io.listen(server);

srv.sockets.on('connection', function (socket) {
  // handles a new connection and observes and program reactions
  console.log('on connection');
  socket.emit('message', 'welcome to this presentation');

  socket.on("slidechanged", function(data){
    socket.broadcast.emit("slidechanged", data);
  });

});

