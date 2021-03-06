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
                    value: i,
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

//เพิ่มข้อสอบใหม่อีกที
router.get("/addNewQuesion", middleware.isLoggedInAdmin, function(req,res){
    map.find({}, function(err,found){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            res.render("adminPage/chooseCheckpoint2",{allMap:found});
        }
    });
});

router.get("/addNewQuesion/:map_id", middleware.isLoggedInAdmin, function(req,res){
    ques.find({idMap: req.params.map_id}, function(err,allQues){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            let n = 1;
            let maxValue = 0;
            let idMaxValue = "";
            var emp;
            allQues.forEach(function(allQues){
                emp = allQues.value * n;
                if(emp > maxValue){
                    maxValue = emp;
                }
            });
            res.render("adminPage/addNewQuesion",{map_id: req.params.map_id, maxValue: maxValue});
        }
    });
});

router.post("/addNewQuesion/:map_id", middleware.isLoggedInAdmin, function(req,res){
    map.findById(req.params.map_id, function(err,found){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            let value = (req.body.maxValue * 1) + 1;
            let n_ques = {
                idMap: found._id,
                level: found.level,
                value: value,
                quesion: req.body.Quesion,
                choice: {
                    one: req.body.c1,
                    two: req.body.c2,
                    three: req.body.c3,
                    four: req.body.c4
                },
                answer: req.body.a
            };
            ques.create(n_ques, function(err){
                if(err){
                    console.log(err);
                    res.redirect("/admin");
                } else{
                    req.flash("success","Add a new quesios success.");
                    res.redirect("/admin/addNewQuesion/"+req.params.map_id);
                }
            });
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
    map.findByIdAndRemove(req.params.map_id, function(err,mapDelete){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            levels.findOne({nameLevel: mapDelete.level}, function(err,found){
                if(err){
                    console.log(err);
                    res.redirect("/admin");
                } else{
                    found.maps.splice(found.maps.indexOf(mapDelete._id),1);
                    found.save();
                }
            });
            ques.find({idMap:mapDelete._id}, function(err,allQues){
                if(err){
                    console.log(err);
                    res.redirect("/admin");
                } else{
                    allQues.forEach(function(allQues){
                        allQues.deleteOne(function(err){
                            if(err){ console.log(err); }
                        });
                    });
                }
            });
            req.flash("success","Delete a checkpoint success.");
            res.redirect("/admin/editOrDeleteCheckpoint");
        }
    });
});

//edit quesions
router.get("/editCheckpoint/:map_id/editOrDeleteQuesions", middleware.isLoggedInAdmin, function(req,res){
    ques.find({idMap: req.params.map_id}, function(err,found){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            res.render("adminPage/editQuesion",{allQues: found,map_id: req.params.map_id});
        }
    });
});

router.put("/editCheckpoint/:map_id/editOrDeleteQuesions/:ques_id", middleware.isLoggedInAdmin, function(req,res){
    let n_ques = {
        quesion: req.body.Quesion,
        choice: {
            one: req.body.c1,
            two: req.body.c2,
            three: req.body.c3,
            four: req.body.c4,
        },
        answer: req.body.a
    };
    ques.findByIdAndUpdate(req.params.ques_id, n_ques, function(err){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            req.flash("success","Edit a quesion success.");
            res.redirect("/admin/editCheckpoint/"+req.params.map_id+"/editOrDeleteQuesions");
        }
    });
});

//delete quesions
router.delete("/editCheckpoint/:map_id/editOrDeleteQuesions/:ques_id", middleware.isLoggedInAdmin, function(req,res){
    ques.findByIdAndRemove(req.params.ques_id, function(err){
        if(err){
            console.log(err);
            res.redirect("/admin");
        } else{
            req.flash("success","Delete a quesion success.");
            res.redirect("/admin/editCheckpoint/"+req.params.map_id+"/editOrDeleteQuesions");
        }
    });
});

router.get("/empty2", middleware.isLoggedInAdmin, function(req,res){
    res.render("adminPage/empty2");
});

module.exports = router;