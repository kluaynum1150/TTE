const express = require("express"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      flash = require('connect-flash'),
      passport = require('passport'),
      passportLocal = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      user = require('./models/user'),
      indexRoutes = require('./routes/index'),
      tteRoutes = require("./routes/userPage");

const app = express();

mongoose.connect('mongodb://localhost:27017/tteDatabase', {useNewUrlParser: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

app.use(require("express-session")({
    secret: 'tte',
    resave: false,
    saveUninitialized: false
})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use("/",indexRoutes);
app.use("/TTE",tteRoutes);

app.listen(3000,function(){
    console.log('Server is started');
});