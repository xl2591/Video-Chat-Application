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
        navigator.mediaDevices.getUserMedia(
            { audio: true, 
            video: { width: 1280, height: 720 }, 
        })
        .then(function (stream) {
        userStream = stream;
        divVideoChatLobby.style = "display:none";
        userVideo.srcObject = stream;
        userVideo.onloadedmetdata = function(e) {
            userVideo.play();
        };
    
    })
        .catch(function(err){
            alert("Counld't access user media");
        }
        );
    }
});
