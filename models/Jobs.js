const mongoose = require('mongoose');

const jobsSchema = mongoose.Schema({
  title: String,
  salery: String,
  experince: String,
  keyword: String,
});


const Jobs = mongoose.model('jobs', jobsSchema);


module.exports = Jobs;
