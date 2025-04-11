const isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "you must be logged in before creating a new listing!");
        res.redirect("/login");
      }else{
        next();
    }
}

module.exports = isLoggedIn;