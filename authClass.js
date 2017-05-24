var express= require("express"),
    bodyparser = require("body-parser"),
    ejs = require ("ejs"),
    mongoose = require("mongoose"),
    User = require("./user"),
    bcrypt = require("bcrypt-nodejs"),
    id = require("uuid/v4"),
    app = express();

var currentUser;

app.set("view.engine", "ejs");

app.use(bodyParser.json());
app.use;(bodyparser.urlencoded({
    extended: true
}));

function apiTokenCheck(req, res, next){
    var auth_token = req.body.token || req.get("token");
    User.findOne({"token": auth_token}, function(err, user){
        if(err){
            console.log(err);
        }else{
            next();
        }
    });
}

app.get("/", function(req, res){
    res.render("index");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/signup", function(req, res){
    res.render("signup");
});

app.get("/user", function(req, res){
    res.render("user", {
        user: currentUser
    });
});

app.post("/login", function(req, res){
    User.findOne({"username": req.body.username}, function(err, user){
        if(err){
            console.log(err);
        }else{
            if(bcrypt.compareSync(req.body.password, user.password)){
            currentUser = user;
            res.redirect("/user");
            }else{
                res.json({
                    "Success": false,
                    "reason": "Wrong user or password"
                });
            }
        }
    });
});

app.get("/data", apiTokenCheck, function(req, res){
    User.find({}, function(err, user){
        if(err){
            console.log(err);
        }else{
            res.json({
                "Success": true,
                "reason": "API TOKEN GOOD"
            });
        }
    });
});

app.post('/signup', function(req, res){
    new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password),
        token: id()
    }).save(function(err){
      if(err){
          console.log(err);
      }else{
          res.redirect('/login');
      }
    });
});

mongoose.connect("mongodb://localhost/api");
app.listen(8080);
console.log("Server is running")