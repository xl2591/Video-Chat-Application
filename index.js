const express = require("express");
const socket = require("socket.io");
const app = express();

let server = app.listen(4000, function () {
    console.log("Server is running");
  });
  
  app.use(express.static("public"));
  
  //Upgrades the server to accept websockets.
  
  let io = socket(server);
  //Triggered when a client is connected.
  io.on("connection", function(socket){
    console.log("User Connected :" + socket.id);

    socket.on("join",function(roomName){

      let rooms = io.sockets.adapter.rooms;
      let room = rooms.get(roomName);
      console.log(rooms);
      
      if(room == undefined){
        socket.join(roomName);
        console.log("Room Created");
        socket.emit("created")
      } else if (room.size == 1){
        socket.join(roomName);
        console.log("Room Joined");
        socket.emit("joined")
      } 
      else {
        
        socket.emit("full")
      }
      console.log(rooms);
    })
    socket.on("ready",function(roomName){
     socket.broadcast.to(roomName).emit("ready");
    });
    
    
    socket.on("candidate",function(candidate,roomName){

      socket.broadcast.to(roomName).emit("candidate",candidate);
    });
    

    socket.on("offer",function (offer,roomName){

      socket.broadcast.to(roomName).emit("offer", offer);
    });
    
    
    socket.on("answer",function(answer,roomName){

      socket.broadcast.to(roomName).emit("answer",answer);
    });
  });