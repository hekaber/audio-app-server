/**
 * Created by hkb on 25.07.17.
 */
"use strict"

const mongoose = require("mongoose");

const mediaType = {
    AUDIO : 0,
    IMAGE : 1,
    TEXT  : 2
};

/* Schema */
const mediaSchema = new mongoose.Schema({
    name: {type: String, required: true},
    type: {type: mediaType, required: true},
    uid: {type: String, required: true},
    updated: {type: Date, set: val => Date.now()},
    uploaded: {type: Boolean, default: false},
    shared: {type: Boolean, default: false},
    file: {type: Object}
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
