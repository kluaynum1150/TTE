const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      user = require("../models/user"),
      middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
    res.render("userPage/index");
});

router.get("/profile", middleware.isLoggedIn, function(req, res){
    res.render("userPage/profile");
});

router.get("/profile/edit", middleware.isLoggedIn, function(req, res){
    res.render("userPage/profileEdit");
});

router.post("/profile/edit", middleware.isLoggedIn, function(req, res){
    let id = req.user.id;
    user.updateOne({_id:id},{$set:{firstname: req.body.firstName.trim(),lastname: req.body.lastName.trim(),username: req.body.username.trim()}}, function(err,profile){
        if(err){
            console.log(err);
        } else{
            res.redirect("/TTE/profile");
        }
    });
});

module.exports = router;