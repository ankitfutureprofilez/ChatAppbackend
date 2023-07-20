const express = require("express")

const app = express()
require("dotenv").config()
const http = require("http")

const cors = require("cors")

app.use(cors())
app.use(express.json())
const apirouter=require("./routes/Index")

app.use(apirouter)

const mongoose=require("mongoose")
mongoose.connect(`${process.env.DB_URL}`)
const { Server } = require("socket.io")
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"],
    },
})


io.on("connection", (socket) => {
    console.log(`user connected ${socket.id}`)

    socket.on("join-room", (data) => {
        socket.join(data);
        console.log(`userId is:${socket.id} join-room ${data}`)
    })

    socket.on("send-message", ({messageData,data}) => {
        console.log("Received message:", messageData);
        io.emit("receive-message", messageData,data);
      });

    socket.on("disconnection", () => {
        console.log("userDisconnect", socket.id);
    })
})

const port = process.env.PORT


server.listen(port, () => { console.log(`server is run  ${port}`) })
