const express = require("express");
const app = express()
const cors = require("cors");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const mongoose = require("mongoose")
app.use(express.json())
const api = require('./routes/Index')
mongoose.connect(`${process.env.DB_URL}`)

const server = app.listen(process.env.PORT, () => { console.log(`server is run  ${process.env.PORT}`) })
io = require("socket.io")(server,{
    cors:{ origin:"http://localhost:3000"}
});

io.on('connection', (socket)=>{ 
    console.log("socket", socket.id)
});

app.use((req, res, next)=>{ 
    req.io = io;
    next();
})

app.use(cors())
app.use('/api', api);


