const mongoose = require("mongoose")

const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")


const userSchema = new schema({
    email:{
        type:String,
        required:true,
    },
    //username and passport passport-local-mongoose hamare lie khud se define kar dega 
});

userSchema.plugin(passportLocalMongoose) // passportlocalmongoose ko yha as a plugin use kie hai schema k andar

module.exports = mongoose.model("User",userSchema)