const socket = io();

document.getElementById('streamForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    socket.emit('startStream', username);

    //socket.emit('twitch_live', username.trim());
});


socket.on('chatMessage', (data) => {
    CreateMessageTiktok(data)
});

socket.on('likeEvent', (like) => {
    console.log('---- ', like)
})


socket.on('chat_Message_twitch', (message_like) => {
    console.log('---- ', message_like)
    CreateMessageTiktok(message_like)
})


socket.on('server_conect_tiktok', (server_conect_tiktok) => {
    chat_input(server_conect_tiktok);
})

socket.on('error_conex', (error_conex) => {
    console.log(error_conex);
    chat_input(error_conex);
})



/**
socket.on('chatMessage', (data) => {
    creacionLiMessage(data)
});

socket.on('likeEvent', (like) => {
    console.log('---- ', like)
})


socket.on('chatMessagelike', (message_like) => {
    console.log('---- ', message_like)
    const message_element = document.createElement('li');
    message_element.textContent = `${message_like.comment}`;
    document.getElementById('messages').appendChild(message_element);
})


socket.on('viewerCount', (counter) => {
    console.log(counter);
})


function creacionLiMessage(data) {
    const message_element = document.createElement('li');
    message_element.textContent = `${data.nickname}: ${data.comment}`;
    document.getElementById('messages').appendChild(message_element);
}

socket.on('chat_Message_twitch', (message_like) => {
    console.log('---- ', message_like)
    const message_element = document.createElement('li');
    message_element.textContent = `${message_like.comment}`;
    document.getElementById('messages').appendChild(message_element);
})

*/


function CreateMessageTiktok (data) {

    // Crear contenedor del mensaje
    const message_div = document.createElement('div');
    message_div.classList.add('message', 'received');

    // Crear encabezado del mensaje
    const message_header = document.createElement('div');
    message_header.classList.add('message-header');

    // Crear el avatar del usuario
    const avatar = document.createElement('img');
    avatar.src = data.profilePictureUrl;
    avatar.alt = 'avatar';
    avatar.classList.add('avatar');

    // Crear nombre del usuario
    const username_span = document.createElement('span');
    username_span.classList.add('username');
    username_span.textContent = data.nickname


    message_header.appendChild(avatar);
    message_header.appendChild(username_span);

    // Crear contenido del mensaje
    const message_content = document.createElement('div');
    message_content.classList.add('message-content');
    message_content.textContent = data.comment;


    // Agregar encabezado, contenido y tiempo al contenedor del mensaje
    message_div.appendChild(message_header);
    message_div.appendChild(message_content);

    const chat_messages = document.getElementById('chat-messages');
    chat_messages.appendChild(message_div);
}


const chat_input = (data) =>{
    const input_label = document.getElementById('input-label');
    input_label.textContent = data.comment;
}