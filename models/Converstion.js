const mongoose = require("mongoose")


const ConverSchema = mongoose.Schema({
    "userA": Number,
    "userB": Number,
    "uid": String,
    "updateAt": { type: Date, default: Date.now() }

})
const Conversion = mongoose.model("Convers", ConverSchema)



module.exports = Conversion

