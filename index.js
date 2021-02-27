const express = require('express');
const socket = require("socket.io");
const app = express();

let server = app.listen(4000, function () {
    console.log("Server is running");
  });
  
  app.use(express.static("public"));
  
  //Upgrades the server to accept websockets.
  
  var io = socket(server);
  io.on("connection", function(socket){

    console.log("User Connected :" + socket.id);

    socket.on("join",function(roomName){
      
    })
  })