var socket = io.connect("http://localhost:4000");
var divVideoChatLobby = document.getElementById("video-chat-lobby");
var divVideoChat = document.getElementById("video-chat-room");
var joinButton = document.getElementById("join");
var userVideo = document.getElementById("user-video");
var peerVideo = document.getElementById("peer-video");
var roomInput = document.getElementById("roomName");

joinButton.addEventListener('click',function() {

    if(roomInput.value == "") {
        alert("Please enter a room name")
    }
    else{
        socket.emit("join",roomInput.value)
        navigator.mediaDevices
        .getUserMedia(
            { audio: true, 
            video: { width: 1280, height: 720 }, 
        })
        .then(function (stream) {
        userStream = stream;
        divVideoChatLobby.style = "display:none";
        userVideo.srcObject = stream;
        userVideo.onloadedmetadata = function(e) {
            userVideo.play();
        };
    
    })
        .catch(function(err){
            alert("Counld't access user media");
        }
        );
    }
});
