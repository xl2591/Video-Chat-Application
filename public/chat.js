let socket = io.connect("http://localhost:4000");
let divVideoChatLobby = document.getElementById("video-chat-lobby");
let divVideoChat = document.getElementById("video-chat-room");
let joinButton = document.getElementById("join");
let userVideo = document.getElementById("user-video");
let peerVideo = document.getElementById("peer-video");
let roomInput = document.getElementById("roomName");
let roomName ;
let creator = false;
let RTCPeerConnection;
let userStream; 

let iceServers ={ iceServers:
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
    socket.emit("ready",roomName);
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
        rtcPeerConnection.ontrack = OnTrackFunction;
        rtcPeerConnection.addTrack(userStream.getTracks([0],userStream));
        rtcPeerConnection.addTrack(userStream.getTracks([1],userStream));
        rtcPeerConnection.createOffer()
            .then((offer) => {
                rtcPeerConnection.setLocalDescription(offer);
                socket.emit("offer",offer,roomName);
            })
            .catch((error) => {console.log(error);})
         
          
        
    }
});
//Triggerd on receiving an ice candidate from the peer
socket.on("candidate",function(candidate){
    var icecandidate = new RTCIceCandidate(candidate);
    rtcPeerConnection.addIceCandidate(icecandidate);
});

//Triggerd on receiving an offer from the person who created the room
socket.on("offer",function(offer){
    if (!creator){

        rtcPeerConnection = new RTCPeerConnection(iceServers); 
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = OnTrackfunction;
        rtcPeerConnection.addTrack(userStream.getTrack([0],userStream));
        rtcPeerConnection.addTrack(userStream.getTrack([1],userStream));
        rtcPeerConnection.setRemoteDescription(offer);
        rtcPeerConnection.createAnswer()

            .then((answer) => {
                rtcPeerConnection.setLocalDescription(answer);
                socket.emit("offer",offer,roomName);
            })
            .catch((error) => {console.log(error);})
    }
});

//Triggered on receiving and answer from the person who joined the room
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