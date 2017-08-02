"use strict";

const express = require("express");

const router  = new express.Router();

const Tag = require("../models/tag");
const auth = require("../auth");
const appModules = require("../app");

/* when we see the uid parameter, set res.locals.user to the User found in the
 database or return a 404 Not Found directly. */
router.param('tid', (req, res, next, tid) => {
    if (mid.match(/^[0-9a-fA-F]{24}$/)) {
        Tag.findById(tid).then(tag => {
            if (!tag) {
                return res.status(404).send();
            } else {
                req.tag = tag;
                return next();
            }
        }).catch(next);
    }
    else {
        return res.status(400).send('invalid id format');
    }
});

// get all tags
router.get("/", auth.token(),
    (req, res, next) => {
        Tag.find({}).then((results) => {
            return res.send(results);
        }).catch(next);
    }
);

// get tag by id
router.get("/:tid/", auth.token(),
    (req, res, next) => {
        const tag = req.tag;
        return res.status(200).send(tag);
    }
);

// delete the tag
router.delete("/:tid/", auth.token(),
    (req, res, next) => {
        let tag = req.tag;
        tag.remove().then(removed => res.send(removed)).catch(next);
    }
);

// create the tag
router.post("/", auth.token(),
    (req, res, next) => {
        let body = req.body;
        let name = body.name.toLowerCase();
        let description = body.description.toLowerCase();

        Tag.find({name: name}).then((results) => {
            if(!results){
                Tag.create({"name": name, "description": description}).then(created => {
                    return res.status(201).send(created);
                }).catch(err => {
                    return res.status(400).send({message: err.message});
                });
            }
            else {
                return res.status(400).send('tag ' + name + ' already exists');
            }
        }).catch(next);

    }
);

module.exports = router;