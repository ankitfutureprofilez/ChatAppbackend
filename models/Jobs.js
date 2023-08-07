const mongoose = require('mongoose');

const jobsSchema = mongoose.Schema({
  title: String,
  salary: String,
  experince: String,
  keyword: String,
  Desc: String,
  Time:String,
  Shift:String,
  position :String
});


const Jobs = mongoose.model('jobs', jobsSchema);


module.exports = Jobs;
