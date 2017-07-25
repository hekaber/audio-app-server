"use strict";

const express  = require("express");
const multer = require("multer");
const router = new express.Router();

const Media = require("../models/media");

let upload = multer({ dest: ' uploads/'}).single('testfile');

/* when we see the uid parameter, set res.locals.user to the User found in the
 database or return a 404 Not Found directly. */
router.param('mid', (req, res, next, mid) => {
    Media.findById(mid).then(media => {
        if (!media) {
            return res.status(404 /* Not Found */).send();
        } else {
            req.media = media;
            return next();
        }
    }).catch(next);
});

// get all medias
router.get("/", (req, res, next) => {
    Media.find({}).then((results) => {
       return res.send(results);
    }).catch(next);
});

// get media by id
router.get("/:mid/", (req, res, next) => {
    return res.status(200).send(req.media);
});

// upload the media description document
router.post("/", (req, res, next) => {
    let body = req.body;
    Media.create({
        "name": body.name,
        "type": body.type,
        "uid": body.uid,
        "uploaded": body.uploaded,
        "shared": body.shared
    }).then(created => {
        return res.status(201).send(created);
    }).catch(err => {
        return res.status(400).send({message: err.message});
    });
});

router.put("/:mid/", (req, res, next) => {
    let media = req.media;

    media.update(req.body).then((updated) => {
        console.log(updated);
        return res.status(200).send('updated');
    }).catch((err) => {
        return res.status(400).send(err);
    });
});
// upload a media file
router.post("/:mid/file/", (req, res, next) => {
    let media = req.media;

    upload(req, res, function(err){
        if(err){
            console.log(err);
            return res.status(400).send(err);
        }
        else {
            console.log(req.file, 'file');
            media.update({
                file: req.file,
                uploaded: true
            }).then((updated) => {
                console.log(updated);
                return res.status(200).send('uploaded and binded to file');
            }).catch((err) => {
                return res.status(400).send('uploaded but error during file binding' + err);
            });

        }
    });
});

module.exports = router;
