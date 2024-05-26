const tmi = require('tmi.js');

const clients = {};

const TwitchLiveConnector = (io, socket) => {
    console.log('Nuevo cliente conectado TWITCH');

    socket.on('twitch_live', (username) => {

        if(clients[socket.id]) clients[socket.id].disconnect();

        console.log(username);
        const client = new tmi.Client({
            channels: [username]
        });

        client.connect();


        client.on('message', (channel, tags, message, self) => {
            console.log('mirando el channel == ',channel);
            console.log('mirando el tags == ',tags);
            console.log('mirando el message ==',message);
            console.log('mirando el self ==',self);
            io.to(socket.id).emit('chat_Message_twitch', {comment: message, profilePictureUrl: '', nickname: tags['display-name']})
        })


        clients[socket.id] = client;

        socket.on('disconnect', () => {
            if(clients[socket.id]){
                clients[socket.id].disconnect();
                delete clients[socket.id];
            }
        })
    })
}

module.exports = { TwitchLiveConnector }