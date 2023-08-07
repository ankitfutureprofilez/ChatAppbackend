const mongoose = require("mongoose")


const CompanySchema = mongoose.Schema({
    name: String,
    website: String,
    Desc: String,
    email: String,
    owner: String,
    Keyword: String,
    number: String, 
    year: String

})

const Company = mongoose.model('Companys', CompanySchema)


module.exports = Company