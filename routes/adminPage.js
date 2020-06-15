const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      user = require("../models/user"),
      map = require("../models/map"),
      middleware = require("../middleware");

router.get("/", middleware.isLoggedInAdmin, function(req, res){
    res.render("adminPage/index");
});

router.get("/login", function(req, res){
    res.render("adminPage/login");
});

router.post('/login', passport.authenticate('local',{
    //successRedirect: '/TTE',
    failureFlash: "Incorrect username or password. Try again.",
    failureRedirect: "/admin/login"
}),function(req, res){
    if(req.user.tag == "admin"){
        res.redirect("/admin");
    } else {
        req.logOut();
        req.flash('error','Incorrect username or password. Try again.');
        res.redirect("/admin/login");
    }
});

//add checkpoint
router.get("/addCheckpoint", middleware.isLoggedInAdmin, function(req,res){
    res.render("adminPage/addCheckpoint");
});

router.post("/addCheckpoint", middleware.isLoggedInAdmin, function(req,res){
    let n_checkpoint = {name: req.body.nameCheckpoint, level: req.body.level, information: req.body.information};
    map.create(n_checkpoint, function(err,newCheckpoint){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            console.log(newCheckpoint);
            res.redirect("/admin");
        }
    });
});

module.exports = router;