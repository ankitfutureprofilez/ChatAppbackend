const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });

mongoose.connect(`${process.env.DB_URL}`, {
   useNewUrlParser: true,
   serverSelectionTimeoutMS: 5000,
   autoIndex: false,  
   maxPoolSize: 10,  
   serverSelectionTimeoutMS: 5000, 
   socketTimeoutMS: 45000, 
   family: 4  
}).then(() => {
   console.log('MongoDB connected successfully');
}).catch((err) => {
   console.error('MongoDB CONNECTION ERROR =>>: ', err);
});