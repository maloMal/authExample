var mongoose = require("mongoose");

var User = new mongoose.Schema({
    username: String,
    password: String,
    token: String
});

mdule.exports = mongoose.model("User", User);