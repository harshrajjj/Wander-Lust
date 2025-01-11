const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync")
const {validatereview, isLoggedIn, isAuthor }= require("../middleware")
const reviewController = require("../controllers/review")




// rating route
router.post("/",isLoggedIn, validatereview,wrapAsync (reviewController.createRating))
  
// delete rating
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteRating))

module.exports = router;