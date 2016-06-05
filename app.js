// server.js

// call the packages we need
var logger = require('morgan');
var express = require('express');       // call express
var session = require("express-session");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var userRoutes = require('./routes/users.js');
var postRoutes = require('./routes/posts.js');
var mongoose = require('mongoose');

var app = express();

app.use(session({secret: 'secret_3162735', saveUninitialized: true, resave: true}));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

var url = '127.0.0.1:27017/' + process.env.OPENSHIFT_APP_NAME;

 if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL +
        process.env.OPENSHIFT_APP_NAME;
}

var connect = function () {
    mongoose.connect(url);
};
connect();

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
        next(err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
