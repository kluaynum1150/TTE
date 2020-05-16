const express = require('express'),
      router = express.Router();
      passport = require('passport'),
      user = require('../models/user');

router.get("/", function(req, res){
    res.render("landing");
});
    
router.get("/login", function(req, res){
    res.render("login");
});

router.post('/login', passport.authenticate('local',{
    successRedirect: '/tarot',
    failureRedirect: 'login'
}),function(req, res){
});
    
router.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/");
});
    
router.get("/signup", function(req, res){
    res.render("signup");
});

router.post('/signup', function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('signup');
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect('/login');
        });
    });
});

module.exports = router;