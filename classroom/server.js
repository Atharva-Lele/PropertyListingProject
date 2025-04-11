const express = require("express");
const app = express();
const flash = require('connect-flash');
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// app.use(cookieParser());
// app.use(cookieParser("secretcode"));
const sessionOptions = {
  secret: "secretstring",
  resave: false, // resave true forces server to store info to session store even if no change was made in info
  saveUninitialized: true, // will save session info in temp storage even if it was not initialiazed
};

app.use(flash());
app.use(session(sessionOptions));

app.get("/register", (req, res)=>{
    let {name = "default"} = req.query;
    // console.log(req.session);
    req.session.name = name;
    console.log(req.session.name);
    req.flash("success", "Name is saved");
    res.send(name);
})

app.get('/hello', (req, res)=>{
    // res.send(`hello, ${req.session.name}`);
    res.locals.messages = req.flash("success");
    res.render("page.ejs", { name : req.session.name}); //access flash using the key 
})

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {                     //even if I open the same link on a new tab
//     req.session.count = 1;
//   }
//   res.send(`${req.session.count} times`);
// });

app.get("/test", (req, res) => {
  res.send("testing");
});

app.listen(3000, (req, res) => {
  console.log("listening on port 3000");
});

// app.get('/getcookies', (req, res)=>{
//     res.cookie("Atharva", "Lele"); //name of cookie is Atharva and value is Lele
//     res.send("cookies sent");
// })

// app.get("/getsignedcookie", (req, res)=>{
//     res.cookie("made-in", "India", {signed: true});
//     res.send("signed cookie sent");
// })

// app.get('/greet', (req, res)=>{
//     let {name = "anonymous"} = req.cookies; //default value 'anonymous' if 'name' key doesn't exist in req.cookies object
//     res.send(`Hello ${name}`);
// })

// app.get('/verify',(req, res)=>{
//     // console.dir(req.cookies);   //req.cookies only returns unsigned cookies, to get signed ones, we have to use req.signedCookies
//     res.send("verified");
//     console.dir(req.signedCookies);
// } )

// app.get("/", (req, res)=>{
//     console.dir(req.cookies);
//     res.send("Get response");
// })

// app.use('/users', users); // Route all calls starting with /users to callbacks in the users object
// app.use('/posts', posts);
