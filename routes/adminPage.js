const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      middleware = require("../middleware");

router.get("/", middleware.isLoggedInAdmin, function(req, res){
    res.render("adminPage/index");
});

module.exports = router;