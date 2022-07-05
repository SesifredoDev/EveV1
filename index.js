

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
    //Device Connection
    clients.push({id: socket.id, userUid:null, deviceType: socket.handshake.query.deviceType})


    // login
    socket.on('login', async (data) => {
        client = clients.find(x => x.id === socket.id)
        login = await fbLogIn(data.email, data.password)
        if (login.uid !== undefined){ //worked!
            userData = await getData(login)
            client.userUid = userData.id
            io.to(client.id).emit('valid', userData);
            socket.join(client.uid)
            socket.to(client.uid).emit("valid", client.deviceType + "joined")
        }else{ //error
            console.log(login)
            io.to(client.id).emit('valid', login);
        }

    })

    // SignUp
    socket.on('signUp', async(data) => {
        client = clients.find(x => x.id === socket.id)
        signup = await fbSignUp(data.email, data.password, data.name)
        io.to(client.id).emit('valid', signup );
    })

    //disconnected Device
    socket.on('disconnect', function() {
        removeByAttr(clients, 'id', socket.id);   
    });


    
})