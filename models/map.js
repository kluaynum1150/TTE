const mongoose = require("mongoose");

const mapSchema = new mongoose.Schema({
    name: String,
    level: String,
    information: String
});

module.exports = mongoose.model("map", mapSchema);