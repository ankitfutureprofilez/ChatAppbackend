const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
require('./config');

const app = express();

const URL = process.env.FRONTENDURL
console.log("URL", process.env.FRONTENDURL);

app.use(cors({
    origin: "*",
  }));
const server = http.createServer(app);

const bodyParser = require('body-parser')

app.use(bodyParser.json())
    const apirouter = require('./routes/Index')
    app.use("/", apirouter)
    app.get('/', (req, res) => {
        res.json({
        "msg": "Active",
        status: 200
    })
})

const Chat = require('./models/Messages'); // Assuming the correct path to your Messages model
const io = socketio(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    console.log(`user connected ${socket.id}`);
    socket.on('join-room', (data) => {
        socket.join(data);
        console.log(`userId is: ${socket.id} join-room ${data}`);
    });
    socket.on('send-message', async (data) => {
        try {
            // Save the message to the database
            const message = new Chat({
                userId: data.userId,
                receiveId: data.receiveId,
                message: data.message,
                time: new Date().toLocaleTimeString(),
            });
            const savedMessage = await message.save();

            // Emit the message to the recipient's socket room
            io.to(data.userId).emit('test-event', {
                receiveId: data.receiveId,
                author: data.username,
                userId: data.userId,
                message: data.message,
                time: new Date().toLocaleTimeString(),
            });
            console.log('Message saved and emitted:', savedMessage);
            console.log('Receiver Message:', message);
        } catch (err) {
            console.log(err);
        }
    });
});

// Start the server
const PORT = process.env.PORT; // Change this to the desired port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//ankitjain
//IJBbNvOBcHJxxseC