var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/simple_login")


// allow db.User
module.exports.User = require("./user");