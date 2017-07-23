/*
 * YABE - Yet Another Blog Engine
 */
"use strict";

const express  = require("express");
const mongoose = require("mongoose");

/* Express Middlewares */
const bodyParser = require("body-parser");
const morgan     = require("morgan");
const passport   = require("passport");

/* Passport Strategies */
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';

// const BasicStrategy = require("passport-http").BasicStrategy;
/* our own modules */
// const User = require("./models/user");

/* create our app */
const app = express();


/* configuration */
app.locals.name   = require("./package.json").name;
app.locals.config = require(`./config/${process.env.NODE_ENV}`);

/* mongoose & MongoDB stuff */
mongoose.Promise = global.Promise; // Use native promises
mongoose.set('debug', (process.env.NODE_ENV === 'development'));

/* mongoose connection */
app.locals.connect = function () {
    const dbname = app.locals.config.mongodb.database;
    console.log(`NODE_ENV=${process.env.NODE_ENV}, connecting to ${dbname}`);
    return mongoose.connect(dbname, {useMongoClient: true});
};

/* Express Middlewares setup */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));
if (process.env.NODE_ENV === 'production')
    app.use(morgan('combined'));
app.use(passport.initialize());

/* authentication: Token Auth with Passport-JWT */
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));

/* our routers */
app.use("/api/users", require("./routers/user"));
app.use("/api/audio", require("./routers/audio"));

// expose our app to require()
module.exports = app;
