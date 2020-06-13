const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      multer = require("multer"),
      path = require("path"),
      fs = require("fs"),
      user = require("../models/user"),
      middleware = require("../middleware");

//ที่เก็บรูป
const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: function(req, file, cb){
        cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

//เช็คนามสกุลของรูป
const imageFilter = function(req, file, cb){
    var ext = path.extname(file.originalname);
    if(ext !== ".png" && ext !== ".gif" && ext !== ".jpg" && ext !== ".jpeg"){
        return cb(new Error("Only image is allowed."),false);
    }
    cb(null, true);
}

//เรียกใช้
const upload = multer({storage: storage, fileFilter: imageFilter});

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