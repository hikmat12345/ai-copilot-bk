const mongoose = require('mongoose')

const signup = new mongoose.Schema({
    email:{
        type:String,
        required:[true]
    },
    name:{
        type:String,
        required:[false]
    },
    mobileNumber:{
        type: Number ,
        required:[false]
    },
    password:{
        type:String,
        required:[true]
    },
   
})

module.exports = mongoose.model('Signup', signup)
