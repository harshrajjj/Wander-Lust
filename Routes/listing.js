const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync")
const {isLoggedIn, isOwner, validateListing} =require("../middleware")
const listingController = require("../controllers/listing")
// cloudnary /storage multer
const {storage} = require("../cloudConfig")
// multer
const multer = require("multer")
const upload = multer({storage})// file aa k kha save hoga yha hum storage ko require kie hai cloudnary k config se 


router // compact form to write to route having same path but different method
.route("/")
.get(wrapAsync( listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),// placed before validation bcz it also parse data coming form form that is in "multipart/form-data" format 
    validateListing,
    wrapAsync (listingController.createListing));

// add new listing routes
router.get("/new",isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.editListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


//Index route
//router.get("/",wrapAsync( listingController.index));

// showw routes // it show individual hotel descriptions
//router.get("/:id",wrapAsync(listingController.showListing));

// create listing
//router.post("/",isLoggedIn,validateListing,wrapAsync (listingController.createListing));


//edit routes
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
//router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.editListing));

// delete route
//router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;