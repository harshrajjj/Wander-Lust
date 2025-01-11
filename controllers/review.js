const Listing = require("../models/listing")
const Review = require("../models/review")

module.exports.createRating = async (req,res,next) => {
    const {id} = req.params
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created")
    res.redirect(`/listing/${id}`)
  }

module.exports.deleteRating = async (req,res,next) => {
    let {id,reviewId} = req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})//pull yha mongo db ka operator h jo remove karta hai data base se if jo condition hmm die hai wo match ho jai to
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted")
    res.redirect(`/listing/${id}`)
  }