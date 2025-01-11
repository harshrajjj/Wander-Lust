const mongoose = require("mongoose")
const user = require("./users")
const schema = mongoose.Schema;

const reviewSchema = new schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type: schema.Types.ObjectId,
        ref:user
    }
})

module.exports = mongoose.model("Review",reviewSchema);