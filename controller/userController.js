const User = require('../models/user');

module.exports.renderSignUp = (req, res) => {
  if(req.isAuthenticated()){
    req.flash("error", "You are already logged in, logout first");
    res.redirect('/listings');
  }
  res.render("signup.ejs");
}

module.exports.signUp =  async (req, res) => {
  try {
    let { username, email, password } = req.body;
    // console.log(username+email+password);
    let newUser = new User({ email, username });
    let regedUser = await User.register(newUser, password);
    if (!regedUser) {
      req.flash("error", "Signup Failed");
      res.redirect("/signup");
    } else {
      req.login(regedUser, (err)=>{
        if(err){
          next(err);
        }
      req.flash("success", "Registered and Logged In!");
      res.redirect("/listings");
      })
    }
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
    
  }
}

module.exports.renderLogin = (req, res) => {
  if(req.isAuthenticated()){
    req.flash("error", "You are already logged in, logout first");
    res.redirect('/listings');
  }
  else{
    // console.log(req.headers.referer.slice(21)); //change when deploying, 21 is for localhost
    // res.locals.referUrl = req.headers.referer.slice(21); 
  }
  res.render("login.ejs");
}

module.exports.Login = async (req, res) => {
    console.log("Req Handler");
    req.flash("success", `Welcome back ${req.session.passport.user}!`);
    console.log("Success message set: ");
    res.redirect(res.locals.redirectUrl || '/listings');
    // res.send("You are logged in!");

}

module.exports.logout = (req, res,next)=>{
  req.logout((err)=>{
    if(err){
      next(err);
    }else{
      req.flash("success", "you are logged out!");
      res.redirect('/listings');
    }
  })
}