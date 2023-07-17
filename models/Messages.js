const mongoose = require("mongoose")
const regSchema = mongoose.Schema({
    message: {
        type: String
    }
})
const Mesages = mongoose.model('messages', regSchema);
module.exports = Mesages;