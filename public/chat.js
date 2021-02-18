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
        navigator.getUserMedia(
            { audio: true, 
            video: { width: 1280, height: 720 }, 
        },
        function(stream) {
        userVideo.srcObject = stream;
        userVideo.onloadedmetdata = function(e) {
            userVideo.play();
        };
    
    },
        function(){
            console.log("Counld't access user media");
        }
        );
    }
})
