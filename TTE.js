const express = require("express");
let app = express();
app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/TTE", function(req, res){
    res.render("landing");
});

app.listen(3000,function(){
    console.log('Server is started');
});