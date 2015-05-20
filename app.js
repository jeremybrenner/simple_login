var express = require('express'),
    bodyParser = require('body-parser'),
    db = require("./models"),
    session = require("express-session"),
    app = express();


var path = require("path");
var views = path.join(process.cwd(), 'views');

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: 'super secret',
  resave: false,
  saveUninitialized: true
}))

app.use("/", function (req, res, next) {
// logs people in by saving their userID
  req.login = function (user) {
  	// user looks like {email: "guy@thing.com", _id: ASDF}
  	// setting users sesstion to store their _id
  	// console(user.id)
    req.session.userId = user.id;
  };

  // fetches user associated with the current session
  req.currentUser = function (cb) {
     console.log(req.session.userId)
     db.User.
      findOne({
          _id: req.session.userId
      },
      //callback which pases the user in
      function (err, user) {
        req.user = user;
        cb(null, user);
      })
  };

  //clears the session
  // req.logout = function () {
  //   req.session.userId = null;
  //   req.user = null;
  // }
 
  next();
});

app.get("/signup", function (req, res) {
  res.sendFile(path.join(views, "signup.html"));
});

app.post("/signup", function(req, res){
	//grabbing user from the request
	var user = req.body.user;
	db.User.// call createSecure with that email & password
		createSecure(user.email,user.password,
			function(err, user){//runs after db.User.create is finished
				//sends response back to the user
				res.redirect("/login")
	})
})


// we will type in user password into a form then
// checking it against the datbase.

app.get("/login", function (req, res) {
  res.sendFile(path.join(views, "login.html"));
});

app.post("/login", function (req, res) {
  var user = req.body.user;

  db.User
    .authenticate(user.email, user.password, 
    function (err, user) {
          // res.send(user);
          if(err){
          	send(err);
          }
          req.login(user);
          res.redirect("/profile");
    });
});


app.get("/profile", function (req, res) {
  req.currentUser(function (err, user) {
        // res.send("Welcome " + user.email)
        res.send("Welcome " + user.email)
   });
});





app.listen(3000, function () {
  console.log("SERVER RUNNING");
});



