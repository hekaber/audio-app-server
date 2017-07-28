/**
 * Created by hkb on 25.07.17.
 */
"use strict"

const mongoose = require("mongoose");

/* Schema */
const tagSchema = new mongoose.Schema({
    name: {type: String, required: true},
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;