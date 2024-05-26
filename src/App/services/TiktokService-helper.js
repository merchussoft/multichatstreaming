const { WebcastPushConnection } = require('tiktok-live-connector');

let active_username = null;
let active_room_id = null;
let is_live = false;

const clients = {};


const handleTikTokConnection  = (io, socket) => {
    console.log('Nuevo cliente conectado TIKTOK', socket.id);

    socket.on('startStream', async (username) => {

        if(clients[socket.id]) clients[socket.id].disconnect();

        const tiktok_connection = new WebcastPushConnection(`@${username}`);

        tiktok_connection.connect()
            .then( state  => {
                console.log(`${username} ${state.roomId} Conectado a la transmisión en vivo de TikTok`);
                io.to(socket.id).to(socket.id).emit('server_conect_tiktok', {comment: `roomId ${state.roomId} Conectado a la transmisión en vivo de TikTok`});
            })
            .catch(err => {
                console.log('No se pudo conectar => ', err);
            });



        // aqui se recive el chat de la session
        tiktok_connection.on('chat', data => {
            io.to(socket.id).emit('chatMessage', data)
        });

        // aqui vamos a capturar y emitir el evento de me gusta
        tiktok_connection.on('like', like => {
            io.to(socket.id).emit('likeEvent', like);
            io.to(socket.id).emit('chatMessagelike', {uniqueId: like.uniqueId, comment: `${like.uniqueId} dio un me gusta`})
        });

        // aqui vamos a emitir los viewers
        tiktok_connection.on('roomUser', viewers_count => {
            io.to(socket.id).emit('viewerCount', viewers_count.viewerCount);
        });

        // vamos a capturar el evento si la seccion esta activa o no 
        tiktok_connection.on('streamEnd', status  => {
            io.to(socket.id).emit('streamEnd', status)
        });

        tiktok_connection.on('member', data => {
            console.log(`${data.uniqueId} ¡Únete a la transmisión!`);
        })

        tiktok_connection.on('error', (err) => {
            io.to(socket.id).emit('error_conex',{ comment: 'Error: LIVE has ended' })
            disconnect_socket(socket);
        });


        clients[socket.id] = tiktok_connection;

        // aqui se desconecta el socket y tambien el api de tiktok
        disconnect_socket(socket);
    })
}

const disconnect_socket = (socket) => {
    socket.on('disconnect', () =>{
        console.log('Cliente desconectado de la transmisión en vivo de TikTok');
        if(clients[socket.id]){
            clients[socket.id].disconnect();
            delete clients[socket.id];
        }
    })
}


module.exports = { handleTikTokConnection }