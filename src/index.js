const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io')

const app = express()

// setting body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// setting cors
app.use(cors())

// passando app como parametro para os controllers
// controllers sao automaticamente adicionados
require('./app/controllers/index')(app);



// para socket
const server = http.Server(app)
const io = socketIO(server)
const clients = {}


// run api 🔥🔥🔥🔥🔥
server.listen(3001, () =>{
    console.log("🔥 Server listen on port 3001 🔥")
});

// socket - nao funcional
io.on('connection', (socket) => {
    let id = socket.id;
    console.log('Novo usuário conectado. ID: ' + id);
    clients[id] = socket;

    socket.on('disconnect', () => {
        console.log('Usuário desconectado. ID: ' + id)
        delete clients[id];
    })
})

// app.listen(3001, () =>{
    
// })