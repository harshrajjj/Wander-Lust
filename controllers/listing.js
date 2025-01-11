const Listing = require("../models/listing")

// geoCoding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index= async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  }

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
  }

module.exports.showListing =  async (req, res) => {
    let { id } = req.params;
                                                        // here we are using nested populat
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
      req.flash("error","Listing you are Requested for does not exist")
      res.redirect("/listing")
    }
    res.render("./listings/show.ejs", { listing });
  }

module.exports.createListing = async (req, res,next) => {
    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location ,
      limit: 1
    })
      .send()
      
    let url = req.file.path;
    let filename = req.file.filename;
    const listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner=req.user._id
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let SavedListing = await newListing.save();
    console.log(SavedListing)
    req.flash("success","New listing created")
    res.redirect("/listing");
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you are Requested for does not exist")
      res.redirect("/listing")
    }
    let originalImageUrl = listing.image.url; // it is done to lower the quality of image when it preview in edit page 
    let OriginalImageUrl = originalImageUrl.replace("/upload/h_300,w_250")
    res.render("./listings/edit.ejs", { listing,OriginalImageUrl });
  }

module.exports.editListing= async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing, });

    if(typeof req.file !=="undefined"){// this is for if image m hum kux image upload kie hai to usko save karwane k lie if nhi kie hai to ye nahi chalega 
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image= {url,filename};
    await listing.save()
    }

    req.flash("success","Edit listing Successful")
    res.redirect(`/listing/${id}`);
  }

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted")
    console.log(deleteListing);
    res.redirect("/listing");
  }