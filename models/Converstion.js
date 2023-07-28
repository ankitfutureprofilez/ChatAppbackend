const mongoose = require("mongoose")


const ConverSchema = mongoose.Schema({
    "userId": Number,
    "receiverId": Number,
    "uid": Number,
    "updateAt": { type: Date, default: Date.now() }

})
const Conversion = mongoose.model("Convers", ConverSchema)



module.exports = Conversion

