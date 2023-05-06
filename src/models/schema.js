const mongoose= require("mongoose")
const Schema = mongoose.Schema;
const Objectid= Schema.Types.Objectid
 
const schema= new Schema({
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
    imagePath:{
        type:String,
        required:[false]
    }
})

const alcohlicPerfume= mongoose.model('alcohlic_perfumes', schema)
module.exports= alcohlicPerfume