const mongoose = require("mongoose")


const ConverSchema = mongoose.Schema({
    "userA": String,
    "userB": String,
    "uid": String,
    "updateAt": {type:Date, default: Date.now()}

})
const Conversion= mongoose.model("Convers",ConverSchema)



module.exports=Conversion

