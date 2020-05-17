const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      user = require('../models/user');

router.get("/", function(req, res){
    res.render("landing");
});
    
router.get("/login", function(req, res){
    res.render("login");
});

router.post('/login', passport.authenticate('local',{
    //successRedirect: '/TTE',
    failureFlash: "Incorrect username or password. Try again.",
    failureRedirect: 'login'
}),function(req, res){
    if(req.user.tag == "user"){
        res.redirect("/TTE");
    } else {
        res.redirect("/admin");
    }
});
    
router.get("/logout", function(req, res){
    req.logout();
    req.flash('success','You log out successfully');
    res.redirect("/");
});
    
router.get("/signup", function(req, res){
    res.render("signup");
});

router.post('/signup', function(req,res){
    user.register(new user({username: req.body.username, firstname: req.body.firstName, lastname: req.body.lastName, tag: "user", map: "1", exp: "0", status: "egg"}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash('error','This username is already taken.');
            res.redirect("/signup");
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect('/TTE');
        });
    });
});

module.exports = router;