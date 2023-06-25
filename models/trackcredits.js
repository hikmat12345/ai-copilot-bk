
const mongoose= require("mongoose")

const trackcredits= new mongoose.Schema({
    user_id:{
        type:String || Number,
        required:[true]
    },  
    trackcredits:{
        type: Number || String,
        required:[false]
    }, 
     created_at:{
        type : Date, 
        default: Date.now,
        required:[false]
    }, 
    
})
module.exports= mongoose.model("trackcredits", trackcredits)
