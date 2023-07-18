const mongoose = require("mongoose")
const regSchema = mongoose.Schema({
    message: {
        type: String
    },
    userid:{
        type:Number
    }
})
const Mesages = mongoose.model('messages', regSchema);
module.exports = Mesages;