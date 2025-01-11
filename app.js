if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError")
const listingRouter = require("./Routes/listing")
const reviewRouter = require("./Routes/review")
const userRouter = require("./Routes/user")
// express session flash
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")


// authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require('./models/users')


const MONGO_URL = process.env.ATLASDB

app.use(express.static(path.join(__dirname, "public")));
app.set("viewengine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


const store = MongoStore.create({
  mongoUrl:MONGO_URL,
  crypto:{
    secret:process.env.SECRETE
  },
  touchAfter:24*3600,
})

store.on("error",(err)=>{
  console.log("ERROR in mongo session store",err)
})
const sessionOption = {
  store,
  secret:process.env.SECRETE,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+1000*60*60*24*3,
    maxAge:1000*60*60*24*3, 
    httpOnly:true,
  }

}


connectDB()
  .then(() => {
    console.log("connected to mongo db");
  })
  .catch((err) => {
    console.log("error in connecting to dataBase : ", err);
  });

async function connectDB() {
  await mongoose.connect(MONGO_URL);
}

app.use(session(sessionOption));
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(user.authenticate()))

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user=req.user
  next();
})


// app.get("/demouser",async (req,res) => {
//   let fakeUser= new user({
//     email:"fakeuser123@gmail.com",
//     username:"fakeStudent" // schema m hum username add nhi kie h but passport automacally add kar dete hai schema m username ko
//   })

//   let registeredUser = await user.register(fakeUser,"helloworld");// user instance and password is given in register we can also give callback here
//   res.send(registeredUser);
// })



// app.get("/", (req, res) => {
//   res.send("Hello World");
// });


app.use("/listing",listingRouter);
app.use("/listing/:id/review",reviewRouter)
app.use("/",userRouter)



//Error handling middleware
app.all("*",(req,res,next) => {
  next(new ExpressError(404,"page not found !"))
})

app.use((err,req,res,next) =>{
    let {statusCode=500 ,message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{statusCode,message})
})

app.listen("8080", () => {
  console.log("Server is running on port 8080");
});
 