const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../AirbnbClone/models/listing.js");
const methodOverride = require("method-override");
const engine = require("ejs-mate");

//util imports
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const flashSetter = require("./utils/flashSetter.js");

const { Listingschema, reviewSchema } = require("./schema.js");
const app = express();
const path = require("path");
const Review = require("./models/reviews.js");

const passport = require("passport");
const localStrategy = require("passport-local");

const User = require("./models/user.js");

//passport uses sessions to keep track of user

const listings = require("./routes/listingRoute.js");
const reviews = require("./routes/reviewRoute.js");
const userRoute = require("./routes/signup.js");
const loginRoute = require("./routes/loginRoute.js");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const flash = require("connect-flash");
const session = require("express-session");

const sessionObj = {
  secret: "nottoshare",
  resave: false,
  saveUninitialized: true,
  cookie: {
    // expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // number of miliseconds to store the cookie(1 week)
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // to prevent cross-scripting attacks
  },
};

app.use(session(sessionObj));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());


main()
  .then(() => {
    console.log("db connected");
  })
  .catch((e) => console.log(e));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

app.listen(3000, () => {
  console.log("Server connected");
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// app.use(flashSetter);

app.use((req, res, next) => {
  console.log("Middleware executed -------- " + req.url + " " + req.method);
  // console.log("Success:", `${res.locals.success}`);
  // console.log("Error:", `${res.locals.error}`);
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/login", loginRoute);
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/signup", userRoute);

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "student-iitb",
//   });

//   let registeredUSer = await User.register(fakeUser, "Helloworld"); //will save the fake user with password Helloworld
//   res.send(registeredUSer);
// });

// app.all("*", (req, res, next) => {
//   //to handle routes other than the ones defined.
//   // console.log("*****************");
//   next(new ExpressError(404, "Page not found"));
//   // next(new Error("Page not found"));
// });

app.get("/logout", (req, res,next)=>{
  req.logout((err)=>{
    if(err){
      next(err);
    }else{
      req.flash("success", "you are logged out!");
      res.redirect('/listings');
    }
  })
})

app.use((err, req, res, next) => {
  // console.dir(err);
  // console.log(err);
  console.log("ERROR HANDLER TRIGGERED");
  // console.log("Error type:", typeof err);
  console.log(err);
  console.log(
    "Is Mongoose Model:",
    err.constructor && err.constructor.name === "model"
  );
  console.log("Request path:", req.path);
  console.log("Request method:", req.method);
  // console.log("Stack trace:", new Error().stack);

  res.status(err.statusCode || 500).render("error.ejs", { err });
});
