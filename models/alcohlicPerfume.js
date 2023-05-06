const mongoose = require('mongoose')

const alcohlicPerfumeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true]
    },
    description:{
        type: String,
        required:[false]
    },
    price:{
        type:Number,
        required:[true]
    },
     quantity:{
        type:Number,
        required:[true]
    },
     top:{
        type:String,
        required:[false]
    },
     middle:{
        type:String,
        required:[false]
    },
     bottom:{
        type:String,
        required:[false]
    },
     discountPrice :{
        type:Number,
        required:[false]
     }, 
    imagePath:{
        type:String,
        required:[false]
    }, 
     gallery_imgs :{
        type:Array,
        required:[false]
     },
     rating :{
        type:String || Number,
        required:[false]
     }
 })

module.exports = mongoose.model('alcohlicPerfumes', alcohlicPerfumeSchema)