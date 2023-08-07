const mongoose = require('mongoose');

const servicesSchema = mongoose.Schema({
    title: String,
    Desc: String,
    Feature: String,
    keyword: String,
    portfolio: [{type: String},]
})




const Services = mongoose.model('Services', servicesSchema);


module.exports = Services;




