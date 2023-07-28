
const io = require('socket.io')(server, {
    cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
    console.log("socket", socket.id);
    socket.on('chatmessage', (data) => {
        console.log("Socket Data InNOde  JS", data)
    });
    app.use('/api', api);
});