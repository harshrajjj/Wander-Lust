if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
  }

const mongoose = require("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js")


const MONGO_URL = process.env.ATLASDB;

connectDB().then(()=>{
    console.log("connected to mongo db")
}).catch((err) => {
    console.log("error in connecting to dataBase : ",err);
})

async function connectDB(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner:"677bf3122982ae34c1b4e85f",
    }))
    await Listing.insertMany(initData.data);
    console.log("data was initialize")
}
initDB();

