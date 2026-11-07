const express = require("express");

const app =express();
const users =require("./routes/user.js");
const posts = require("./routes/post.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path =require("path");
const { name } = require("ejs");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//using express session npm package
const sessionOptions={
    secret:"mysupersecreatestring",
    resave:"false",
    saveUninitialized:"true"
}

app.use(session(sessionOptions));
app.use(flash());

// app.use(cookieParser());

app.get("/test",(req,res)=>{
    res.send("test sucessfull");
})
app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
    req.session.count=1;
    }
    res.send(`you sent request ${req.session.count} times`);
})

app.get("/register",(req,res)=>{
    let {name ="anonymous"}=req.query;
     req.session.name = name;
     if(name === "anonymous"){
         req.flash("error","user not registered");
     }else{
         req.flash("sucess","user registered sucessfully");
     }
    
     res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
//    console.log( req.flash('sucess'));
res.locals.sucess = req.flash('sucess');
res.locals.error = req.flash('error');
    res.render("page.ejs",{name:req.session.name});
})
 app.listen("3000",()=>{
    console.log("app is listening at port 3000");
})
 