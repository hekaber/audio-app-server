/*
 * YABE - User router
 */
"use strict";

const express = require("express");
const auth    = require("../auth");
const passport = require("passport");
const router = new express.Router();

/* our applications modules */
const User = require("../models/user");
const Media = require("../models/media");

/* when we see the uid parameter, set res.locals.user to the User found in the
 database or return a 404 Not Found directly. */
router.param('uid', (req, res, next, uid) => {
    if (uid.match(/^[0-9a-fA-F]{24}$/)) {

        User.findById(uid).then(user => {
            if (!user) {
                return res.status(404 /* Not Found */).send();
            } else {
                res.locals.user = user;
                return next();
            }
        }).catch(next);
    }
    else {
        return res.status(400).send('invalid id format');
    }
});

// create a user
router.post("/",
    (req, res, next) => {
        let body = req.body;
        if(body.name && body.psw){
            User.create({"name": body.name}).then(created => {
                created.resetPassword(body.psw).then( _ => {
                    return res.status(201).send(created);
                }).catch(err => {
                    created.remove();
                    return next(err);
                });
            }).catch(err => {
                if (err.name === 'ValidationError') {
                    return res.status(400 /* Bad Request */).send({
                        message: err.message
                    });
                }
                return next(err);
            });
        }
    }
);

// read all the users
router.get("/", auth.token(),
            (req, res, next) => {
                User.find({}).then(results => {
                    return res.send(results);
                }).catch(next);
            }
);

// read a user
router.get("/:uid", auth.token(),
    (req, res, next) => {
        const user = res.locals.user;
        return res.send(user);
    }
);

// read all medias from user
router.get("/:uid/medias/", (req, res, next) => {
    let id = req.param.uid;
    Media.find({"uid": id}).then((results) => {
        return res.status(200).send(results);
    }).catch((err) => {
        return res.status(400).send(err);
    });
    return res.send(user);
});

//read one of user's audio
router.get("/:uid/medias/:mid", (req, res, next) => {
    return res.send('audio');
});

router.post("/:uid/audio/", (req, res, next) => {
    return res.send('all audio');
});

router.post("/:uid/actions/set-password", auth.token(),
    (req, res, next) => {
        const password = req.body.password;
        const user = res.locals.user;
        if (user.hash)
            return res.send(400);
        user.resetPassword(password).then(() => {
            res.status(200).send();
        }).catch(next);
    }
);

// change a user's password
router.post("/:uid/actions/reset-password", auth.token(), function (req, res, next) {
    const logged_in = req.user;
    const target = res.locals.user;
    console.dir(logged_in.toJSON(), {colors: true});
    console.dir(target.toJSON(), {colors: true});
    if (logged_in._id.toString() === target._id.toString())
        return next();
    else
        res.status(403 /* Forbidden */).end();
}, (req, res, next) => {
    const password = req.body.password;
    const user = res.locals.user;
    user.resetPassword(password).then(() => {
        res.status(200 /* OK */).send();
    }).catch(next);
});


// delete a user
router.delete("/:uid", auth.token(), function (req, res, next) {
    const logged_in = req.user;
    const target = res.locals.user;
    if (logged_in._id.toString() === target._id.toString())
        return next();
    else
        res.status(403 /* Forbidden */).end();
}, (req, res, next) => {
    const user = res.locals.user;
    user.remove().then(removed => res.send(removed)).catch(next);
});

// expose our router to require()
module.exports = router;
