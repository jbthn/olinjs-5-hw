
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , models = require('./models')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , Facebook = require('facebook-node-sdk');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(Facebook.middleware({ appId: '132902443543553', secret: '5d3232f38223ecaba6535794649e6aa4' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  var uristring = 
    process.env.MONGODB_URI ||
    process.env.MONGOLAB_URI ||
    'mongodb://localhost/facespace';
  var mongoOptions = { db: { safe: true }};

  mongoose.connect(uristring, mongoOptions, function (err, res) {
    if (err) {
      console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
      console.log('Succeeded connecting to:' + uristring + '.');
    }
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

function facebookGetUser() {
  return function(req, res, next) {
    req.facebook.getUser( function(err, user) {
      if (!user || err){
        res.render('login', {title: 'Welcome to ShittyFaceSpace!'});
      } else {
        req.user = user;
        next();
      }
    });
  }
}

app.get('/login', Facebook.loginRequired(), routes.login);
app.get('/', facebookGetUser(), routes.index);
app.get('/logout', facebookGetUser(), function(req, res){
  req.user = null;
  req.session.destroy();
  res.redirect('/');
});
app.post('/', facebookGetUser(), routes.update);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
