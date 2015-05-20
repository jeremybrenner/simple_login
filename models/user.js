var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    email: String,
    passwordDigest: String
});

//sign up
// create secure takes a password and email
userSchema.statics.createSecure = function(email, password, cb) {
    // saves the user email and hashes the password
    var that = this; // save the context
    this.findOne({
            email: email // find user by email
        }, // then, if it exists with that email
        function(err, user) {
            // console.log(user)
            if (user) {
                console.log("Already Created")
            } else {
                //generate the salt
                bcrypt.genSalt(function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        // console.log(hash);
                        that.create({
                            email: email,
                            passwordDigest: hash
                        }, cb);
                    });
                });
            }

        });
};

userSchema.statics.encryptPassword = function(password) {
    var hash = bcrypt.hashSync(password, salt);
    return hash;
};

// sign in
userSchema.statics.authenticate = function(email, password, cb) {
    this.findOne({
            email: email // find user by email
        }, // then, if it exists with that email
        function(err, user) {
            // console.log(user)
            if (user.checkPassword(password)) {
                cb(null, user); // send back user
            }

        })
}

userSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.passwordDigest);
};


var User = mongoose.model("User", userSchema);

module.exports = User;