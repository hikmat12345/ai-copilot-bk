const mongoose= require("mongoose")

const user_content= new mongoose.Schema({
    user_id:{
        type:String || Number,
        required:[true]
    },
    description:{
        type: String,
        required:[false]
    },
    boxname:{
        type: String,
        required:[false]
    }, 
    created_at:{
        type : Date, 
        default: Date.now,
        required:[false]
    }, 
})
module.exports= mongoose.model("user_content", user_content)
