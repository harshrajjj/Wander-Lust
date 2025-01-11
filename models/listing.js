const mongoose = require("mongoose")
const Review = require("./review")
const User = require("./users")
const schema = mongoose.Schema;

// creating database schema
const listingSchema = new schema({
    title :{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    image:{
       url:String,
       filename:String
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
        type:schema.Types.ObjectId,
        ref:"Review"
        }
],
    owner:{
        type:schema.Types.ObjectId,
        ref:User
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    }


})

// middleware as if listing he delete ho gya to hum usse related sare review v delete kar denge
// yha par findoneAndDelete islie likha hai kyu ki find by id and delete find one and delete p kaam karta hai and jab v wo trigger hoga uske baad ye call ho jyga
listingSchema.post("findOneAndDelete",async (listing) => {
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})


// making database schema model
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;