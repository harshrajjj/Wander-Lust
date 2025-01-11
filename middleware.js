const Listing = require("./models/listing");
const review = require("./models/review");
const {listingSchema,reviewSchema} = require("./schema")
const ExpressError = require("./utils/expressError")

module.exports.isLoggedIn=(req,res,next)=> {
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;// jo original url p call lga h usko yha store kie hai taki baad m jab user llogon kar k aai to wo usi page se start kre isko session m store karwa rhe hai 
        req.flash("error","you must be logged in to create listing!")
        return res.redirect("/login")
      }
      next();
}


// jo redirect url ko upar session m save karwai hai jab user login hota hai to passport session ko reset kar deta hai to mera save kia hua redirecturl delete ho jta hai so iske krn hum log usko local m save karwa rhe hai 
module.exports.saveRedirectUrl = (req,res,next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
  let list =await Listing.findById(id);
  if(!list.owner.equals(res.locals.user._id)){
    req.flash("error","You are not the owner of this listing")
    return res.redirect(`/listing/${id}`)
  }
  next();
}


module.exports.validateListing = (req,res,next) => {
  const {error} = listingSchema.validate(req.body)// validation schema server side from joi 
  if(error){
    // let errMsg = error.details.map((el) => 
    //   el.message).join(",");
    throw new ExpressError(400,error);
  }
  else {
    next();
  }
}

module.exports.validatereview = (req,res,next) => {
  const {error} = reviewSchema.validate(req.body)// validation schema server side from joi 
  if(error){
    // let errMsg = error.details.map((el) => 
    //   el.message).join(",");
    throw new ExpressError(400,error);
  }
  else {
    next();
  }
}

module.exports.isAuthor = async (req,res,next)=>{
  let { reviewId,id } = req.params;
  let revi =await review.findById(reviewId);
  if(!revi.author.equals(res.locals.user._id)){
    req.flash("error","You are not the author of this review")
    return res.redirect(`/listing/${id}`)
  }
  next();
}