const mongoose = require('mongoose')

const Accounts = new mongoose.Schema({
    name:{
        type:String,
        required:[false]
    },
    email:{
        type:String,
        required:[true]
    },
    password:{
        type: String,
        required:[false]
    } 
})

module.exports = mongoose.model('admin_accounts', Accounts)