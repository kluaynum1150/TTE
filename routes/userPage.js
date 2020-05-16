const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
    res.render("userPage/index");
});

module.exports = router;