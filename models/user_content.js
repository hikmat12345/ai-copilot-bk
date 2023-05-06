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
    box_name:{
        type: String,
        required:[false]
    }, 
})
module.exports= mongoose.model("user_content", user_content)