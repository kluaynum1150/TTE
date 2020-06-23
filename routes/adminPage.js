const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      user = require("../models/user"),
      map = require("../models/map"),
      levels = require("../models/level"),
      ques = require("../models/quesions"),
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
    levels.findOne({nameLevel: req.body.level}, function(err,found){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            map.create(n_checkpoint, function(err,newCheckpoint){
                if(err){
                    console.log(err);
                    res.redirect("/admin");
                } else{
                    found.maps.push(newCheckpoint);
                    found.save();
                    req.flash("success","Add a new checkpoint success.");
                    res.redirect("/admin/"+newCheckpoint._id+"/addQuesions");
                    // res.redirect("/admin");
                }
            });
        }
    });
});

//add Quesion 

router.get("/:map_id/addQuesions", middleware.isLoggedInAdmin, function(req,res){
    res.render("adminPage/empty",{info_id:req.params.map_id});
});

router.post("/:map_id/addQuesions", middleware.isLoggedInAdmin, function(req,res){
    var idMap = req.body.idMap;
    var numQues = req.body.numQues;
    var info = req.body;
    map.findById(idMap, async function(err,found){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            for(var i = 1;i<=numQues;i++){
                let n_ques = {
                    idMap: idMap,
                    level: found.level,
                    quesion: info['q'+i],
                    choice: {
                        one: info['q'+i+'c1'],
                        two: info['q'+i+'c2'],
                        three: info['q'+i+'c3'],
                        four: info['q'+i+'c4']
                    },
                    answer: info['aq'+i]
                };
                await ques.create(n_ques, async function(err,added){
                    if(err){
                        console.log(err);
                        res.redirect("/admin");
                    }
                });
            };
            req.flash("success","Add a new quesios success.");
            res.redirect("/admin");
        }
    });
});

//find all checkpoint
router.get("/editOrDeleteCheckpoint", middleware.isLoggedInAdmin, function(req,res){
    map.find({},function(err,found){
        if(err){
            console.log(err);
        } else{
            res.render("adminPage/chooseCheckpoint",{allMap:found});
        }
    });
});

//edit checkpoint
router.get("/editCheckpoint/:map_id", middleware.isLoggedInAdmin, function(req,res){
    map.findById(req.params.map_id, function(err,foundMap){
        if(err){
            console.log(err);
            res.redirect("/admin/editOrDeleteCheckpoint")
        } else{
            res.render("adminPage/editCheckpoint",{info_map:foundMap});
        }
    });
});

router.put("/editCheckpoint/:map_id", middleware.isLoggedInAdmin, function(req,res){
    let n_info = {name: req.body.nameCheckpoint, level: req.body.level, information: req.body.information};
    map.findByIdAndUpdate(req.params.map_id, n_info, function(err,updated){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            req.flash("success","Edit a checkpoint success.");
            res.redirect("/admin/editOrDeleteCheckpoint");
        }
    });
});

//delete checkpoint
router.delete("/deleteCheckpoint/:map_id", middleware.isLoggedInAdmin, function(req,res){
    map.findByIdAndRemove(req.params.map_id, function(err){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            req.flash("success","Delete a checkpoint success.");
            res.redirect("/admin/editOrDeleteCheckpoint");
        }
    });
});

//get empty
// router.get("/empty", middleware.isLoggedInAdmin, function(req,res){
//     res.render("adminPage/empty");
// });

router.get("/empty2", middleware.isLoggedInAdmin, function(req,res){
    res.render("adminPage/empty2");
});

module.exports = router;