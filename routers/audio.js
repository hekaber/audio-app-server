"use strict";

const express  = require("express");
const multer = require("multer");
const router = new express.Router();

let upload = multer({ dest: ' uploads/'}).single('testfile');

// upload an audio
router.post("/", (req, res, next) => {
    upload(req, res, function(err){
        if(err){
            console.log(err);
        }
        else {
            console.log(req.body, 'Body');
            console.log(req.file, 'file');
            res.send('uploaded');
        }
    });
});

module.exports = router;
