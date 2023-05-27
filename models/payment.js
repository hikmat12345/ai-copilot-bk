const mongoose = require('mongoose')
 const payment = new mongoose.Schema({
    email:{
        type:String,
        required:[true]
    },
    name:{
        type:String,
        required:[false]
    },
    address:{
        type: String ,
        required:[false]
    },
    city:{
        type:String,
        required:[false]
    },
  
  postcode:{
        type:String,
        required:[false]
    },
  userid:{
        type:String,
        required:[false]
    },
  amount:{
        type:Number,
        required:[false]
    },
  id:{
        type:String,
        required:[false]
    },
    clientSecret:{
        type:String,
        required:[false]
    },
  
})

module.exports = mongoose.model('payment', payment)
