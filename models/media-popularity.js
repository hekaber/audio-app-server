/**
 * Created by hkb on 03.08.17.
 */
/**
 * Created by hkb on 25.07.17.
 */
"use strict"

const mongoose = require("mongoose");


/* Schema */
const mediaPopularitySchema = new mongoose.Schema({
    mid: {type: String, required: true},
    likes: [String],
    dislikes: [String]
});

const MediaPopularity = mongoose.model('MediaPopularity', mediaPopularitySchema);

module.exports = MediaPopularity;