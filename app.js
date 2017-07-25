/*
 * YABE - Yet Another Blog Engine
 */
"use strict";

const express  = require("express");
const mongoose = require("mongoose");

/* Express Middlewares */
const bodyParser  = require("body-parser");
const morgan      = require("morgan");
const passport    = require("passport");
const bcrypt      = require("bcrypt");
const jwt         = require("jsonwebtoken");
const passportJWT = require("passport-jwt");

/* Passport Strategies */
let JwtStrategy = passportJWT.Strategy,
    ExtractJwt  = passportJWT.ExtractJwt;
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = 'secret';
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';

/* our own modules */
const User = require("./models/user");

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
let strategy = new JwtStrategy(opts, function(jwt_payload, next) {
                    console.log('payload received', jwt_payload);
                    User.findOne({id: jwt_payload.sub}, function(err, user) {
                        if (err) {
                            return next(err, false);
                        }
                        if (user) {
                            return next(null, user);
                        } else {
                            return next(null, false);
                            // or you could create a new account
                        }
                    });
                });

passport.use(strategy);

app.post("/login", function(req, res) {
    if(req.body.name && req.body.psw){
        let name = req.body.name;
        let password = req.body.psw;
        let loginError = 'Username or password are invalid.'
        // usually this would be a database call:
        User.findOne({name: name}).then(user => {
            if (!user)
                res.status(404).send(loginError);

            return bcrypt.compare(password, user.hash).then(success => {
                let payload = { id: user.id };
                let options = { expiresIn: "1m", audience: opts.audience, issuer: opts.issuer }
                let token = jwt.sign(payload, opts.secretOrKey, options);

                if(success){
                    res.json({message: "ok", token: token});
                    res.status(200).send();
                }
                else {
                    res.status(404).send(loginError);
                }
                return (success ? user : false);
            });
        }).catch(err => res.status(404).send(err));
    }
});
/* our routers */
app.use("/api/user", require("./routers/user"));
app.use("/api/media", require("./routers/media"));


// expose our app to require()
module.exports = app;
