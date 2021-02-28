var socket = io.connect("http://localhost:4000");
var divVideoChatLobby = document.getElementById("video-chat-lobby");
var divVideoChat = document.getElementById("video-chat-room");
var joinButton = document.getElementById("join");
var userVideo = document.getElementById("user-video");
var peerVideo = document.getElementById("peer-video");
var roomInput = document.getElementById("roomName");
var roomName ;
var creator = false;
var RTCPeerConnection;
var userStream; 

var iceServers ={ iceServers:
    [
    {urls: "stun:stun.services.mozilla.com"},
    {urls: "stun:stun.l.google.com:19302"},
],

};

joinButton.addEventListener('click',function() {

    if(roomInput.value == "") {
        alert("Please enter a room name")
    }
    else{
        socket.emit("join",roomName);
    }
});

socket.on("created",function(){
    creator = true;
  
    navigator.mediaDevices
    .getUserMedia( 
        { audio: false, 
        video: { width: 1280, height: 720 }, 
    })
    .then(function (stream) {
    userStream = stream;
    divVideoChatLobby.style = "display:none";
    userVideo.srcObject = stream;
    userVideo.onloadedmetadata = function(e) {
        userVideo.play();
    };
    socket.emit("ready",roomName);
}) 
    .catch(function(err){
        alert("Counld't access user media");
    }
    );

});
socket.on("joined",function(){
    creator = false;
   
    navigator.mediaDevices
    .getUserMedia(
        { audio: false, 
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
});
socket.on("full",function(){
    alert("Room is full, Can't join")
});
socket.on("ready",function(){
    if (creator){

        rtcPeerConnection = new RTCPeerConnection(iceServers); 
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = OnTrackfunction;
        rtcPeerConnection.addTrack(userStream.getTrack([0],userStream));
        rtcPeerConnection.addTrack(userStream.getTrack([1],userStream));
        rtcPeerConnection.createOffer(
            function(offer){
                rtcPeerConnection.setLocalDescription(offer);
                socket.emit("offer",offer,roomName);
            },
            function(error){
                console.log(error);
            }
        );
    }
});
socket.on("candidate",function(candidate){
    var icecandidate = new RTCIceCandidate(candidate);
    rtcPeerConnection.addIceCandidate(candidate);
});
socket.on("offer",function(offer){
    if (!creator){

        rtcPeerConnection = new RTCPeerConnection(iceServers); 
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = OnTrackfunction;
        rtcPeerConnection.addTrack(userStream.getTrack([0],userStream));
        rtcPeerConnection.addTrack(userStream.getTrack([1],userStream));
        rtcPeerConnection.setRemoteDescription(offer);
        rtcPeerConnection.createAnswer(
            function(answer){
                rtcPeerConnection.setLocalDescription(answer);
                socket.emit("answer",answer,roomName);
            },
            function(error){
                console.log(error) 
            } 
        );
    }
});
socket.on("answer",function(answer){
    rtcPeerConnection.setRemoteDescription(answer);
});

function OnIceCandidateFunction(event){
if (event.candidate){socket.emit("candidate",event.candidate,roomName);}

};

function OnTrackfunction(event) {
   
    peerVideo.srcObject = event.streams[0];
    peerVideo.onloadedmetadata = function(e) {
        peerVideo.play();
 
}} 