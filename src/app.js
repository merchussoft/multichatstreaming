const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { handleTikTokConnection } = require('./App/services/TiktokService-helper');
const { TwitchLiveConnector } = require('./App/services/TwitchLive-helper');


const app = express();
const server = http.createServer(app);
const io = socketIo(server)


// settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT_APP || 3020);


//middleware 
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.get('/', (req, res) => {
    res.render('index');
})


io.on('connection', (socket) => {
    handleTikTokConnection(io, socket);
    //TwitchLiveConnector(io, socket);
})


module.exports = {
    app,
    server,
    io
}