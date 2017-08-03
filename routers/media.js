"use strict";

const express = require("express");
const multer  = require("multer");
const router  = new express.Router();
const jwt     = require("jsonwebtoken");

let upload = multer({ dest: ' uploads/'}).single('testfile');

const Media = require("../models/media");
const MediaPopularity = require("../models/media-popularity");

const auth = require("../auth");
const appModules = require("../app");
const opts = appModules.opts;

/* when we see the uid parameter, set res.locals.user to the User found in the
 database or return a 404 Not Found directly. */
router.param('mid', (req, res, next, mid) => {
    if (mid.match(/^[0-9a-fA-F]{24}$/)) {
        Media.findById(mid).then(media => {
            if (!media) {
                return res.status(404 /* Not Found */).send();
            } else {
                req.media = media;
                return next();
            }
        }).catch(next);
    }
    else {
        return res.status(400).send('invalid id format');
    }
});

// router.param('mpid', (req, res, next, mid) => {
//     if (mid.match(/^[0-9a-fA-F]{24}$/)) {
//         MediaPopularity.findById(mpid).then(mediaPop => {
//             if (!mediaPop) {
//                 return res.status(404 /* Not Found */).send();
//             } else {
//                 req.mediaPop = mediaPop;
//                 return next();
//             }
//         }).catch(next);
//     }
//     else {
//         return res.status(400).send('invalid id format');
//     }
// });

// get all medias
router.get("/", auth.token(),
    (req, res, next) => {
        Media.find({}).then((results) => {
            return res.send(results);
        }).catch(next);
    }
);

// get media by id
router.get("/:mid/", auth.token(),
    (req, res, next) => {
        const media = req.media;
        return res.status(200).send(media);
    }
);

router.get("/:mid/popularity", auth.token(),
    (req, res, next) => {
        let mediaId = req.params.mid;
        MediaPopularity.find({mid: mediaId}).then((results) => {
            return res.status(200).send(results);
        }).catch((err) => {
            return res.status(400).send(err);
        });
    }
);
//
// router.put("/:mid/popularity", auth.token(),
//     (req, res, next) => {
//         let mediaId = req.params.mid;
//         MediaPopularity.find({mid: mediaId}).then((results) => {
//             let body = req.body;
//             let mediaPop = results[0];
//             if (body.like && body.dislike){
//                 return res.status(400).send('Cannot like and dislike at the same time.');
//             }
//             if (body.like && mediaPop.likes.indexOf(body.like) <= -1){
//                 mediaPop.likes.push(body.like);
//                 //check if user did not dislike before
//                 let index = mediaPop.dislikes.indexOf(body.like);
//                 if (index > -1){
//                     mediaPop.dislikes.splice(index, 1);
//                 }
//                 mediaPop.update().then((updated) => {
//                     console.log(updated);
//                     return res.status(200).send('liked!');
//                 });
//
//             }
//
//             if (body.dislike && mediaPop.dislikes.indexOf(body.dislike) <= -1){
//                 mediaPop.dislikes.push(body.dislike);
//                 //check if user did not like before
//                 let index = mediaPop.likes.indexOf(body.dislike);
//                 if (index > -1){
//                     mediaPop.likes.splice(index, 1);
//                 }
//                 mediaPop.update().then((updated) => {
//                     console.log(updated);
//                     return res.status(200).send('disliked!');
//                 });
//             }
//         }).catch((err) => {
//             return res.status(400).send(err);
//         });
//     }
// );


// create the media description document
router.post("/", auth.token(),
    (req, res, next) => {
        let body = req.body;
        Media.create({
            "name": body.name,
            "type": body.type,
            "uid": body.uid,
            "uploaded": body.uploaded,
            "shared": body.shared,
            "tags": body.tags
        }).then(created => {
            return res.status(201).send(created);
        }).catch(err => {
            return res.status(400).send({message: err.message});
        });
    }
);

//delete the media description document
router.delete("/:mid/", auth.token(),
    (req, res, next) => {
        let media = req.media;

        //we assume the authorization header has been checked in auth token
        let authorization = req.headers.authorization, decoded;
        try {
            let tok = authorization.split(' ')[1];
            decoded = jwt.verify(tok,'secret');
        }
        catch (err){
            return res.status(401).send('unauthorized decoded' + err);
        }
        if(decoded.id === media.uid){
            media.remove().then(removed => res.send(removed)).catch(next);
        }
        else {
            return res.status(401).send('Only the media owner is allowed to delete')
        }
    }
);

router.put("/:mid/", auth.token(),
    (req, res, next) => {
        const media = req.media;

        media.update(req.body).then((updated) => {
            console.log(updated);
            return res.status(200).send('updated');
        }).catch((err) => {
            return res.status(400).send(err);
        });
    }
);

// upload a media file
router.post("/:mid/file/", auth.token(),
    (req, res, next) => {
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
    }
);

module.exports = router;
