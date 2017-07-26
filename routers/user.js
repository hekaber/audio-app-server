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

// read all the users
router.get("/", auth.token(),
            (req, res, next) => {
                User.find({}).then(results => {
                    return res.send(results);
                }).catch(next);
            }
);

router.get("/authenticate", auth.token(),
    (req, res, next) => {
        return res.send('ok');
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
        const password = req.body.psw;
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
    const password = req.body.psw;
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
