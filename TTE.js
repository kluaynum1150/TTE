const express = require("express");
let app = express();
app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/");
});

app.get("/signup", function(req, res){
    res.render("signup");
});

app.listen(3000,function(){
    console.log('Server is started');
});