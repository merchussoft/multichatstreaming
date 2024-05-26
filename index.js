const { app, server, socket, io } = require('./src/app');



server.listen( app.get('port'), () => console.log('conexion establecida en el puerto '+ app.get('port')));