

const firebase = require('./services/firebase.js')

const express = require('express');
const cors = require('cors');
const app = express()
const http = require('http');
const { getEnvironmentData } = require('worker_threads');

const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"} })

var clients = []

app.use(cors());

//remove obj 
var removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}




server.listen(3000, ()=>{
    console.log('lsitening')
} );
io.on("connection", (socket)=>{
    clients.push({id: socket.id, userUid:null, deviceType: socket.handshake.query.deviceType})
    console.log(clients)


    // login
    socket.on('login', async (data) => {
        client = clients.find(x => x.id === socket.id)
        login = await fbLogIn(data.email, data.password)
        if (login.uid !== undefined){ //worked!
            userData = await getData(login)
            io.to(client.id).emit('valid', userData);
        }else{ //error
            console.log(login)
            io.to(client.id).emit('valid', login);
        }

    })

    // SignUp
    socket.on('signUp', (data) => {
        client = clients.find(x => x.id === socket.id)
        fbSignUp(data.email, data.password, data.name)
        io.to(client.id).emit('valid', "worked" );
    })

    socket.on('disconnect', function() {
        removeByAttr(clients, 'id', socket.id);   
    });
    socket.on("sendMessage", (data)=> {
        console.log(clients)
    })


    
})