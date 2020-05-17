module.exports = {
    isLoggedIn(req, res, next){
        if(req.isAuthenticated() && req.user.tag == "user"){
            return next();
        } else{
            if(req.isAuthenticated() && req.user.tag == "admin"){
                req.flash('error', 'You are an admin. Please log out and log in as a user.');
                res.redirect('/admin');
            } else{
                req.flash('error', 'You need to login first');
                res.redirect('/login');
            }
        }
    },

    isLoggedInAdmin(req, res, next){
        if(req.isAuthenticated() && req.user.tag == "admin"){
            return next();
        } else{
            if(req.isAuthenticated() && req.user.tag == "user"){
                req.flash('error', 'You are not admin.');
                res.redirect('/TTE');
            } else {
                req.flash('error', 'You must be logged in as an administrator.');
                res.redirect('/login');
            }
        }
    },

    checkForm(req, res, next){

    }
} 