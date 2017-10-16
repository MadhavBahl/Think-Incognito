var client = new ClientJS(); // Create A New Client Object
var fingerprint = client.getFingerprint(); // Get Client's Fingerprint

var socket = io.connect('/' || 'http://localhost:8080');
var data = {fingerprint: fingerprint};

var show1 = document.getElementById('show1');
var show2 = document.getElementById('show2');
var fetchName = document.getElementById('fetchName');

console.log('sending: ' + fingerprint);
socket.emit('sendFP',data);
console.log('Sent: ',data);

document.getElementById('submitBTN').addEventListener("click", function(event){
    event.preventDefault();
});

function sendData() {
  var name = document.getElementById('name').value;
  // alert('Sending data for name : ' + name + ' fingerprint: ' + data.fingerprint);
  var userData = {
    name: name,
    fingerprint: data.fingerprint
  };
  socket.emit('sendDataFP',userData);
};

function forget() {
    socket.emit('forgetSentData',data);
}

socket.on('sendbackDataFP',(sendbackData) => {
    console.log('Wow User data is being recieved');
    console.log('The user details are: ',sendbackData);
    show1.style.display = 'none';
    show2.style.display = 'block';
    fetchName.innerHTML = sendbackData.name;
});

socket.on('sendbackFP',(sendback) => {
    console.log('WOW I AM RECIEVING MSG');
    console.log('The message from the server is: ',sendback.status);

    if(sendback.status === 'Found') {
        show1.style.display = 'none';
        show2.style.display = 'block';
        fetchName.innerHTML = sendback.name;
    } 
});

socket.on('deletedFP',(getbackFP) => {
    console.log('Wow the fingerprint was deleted!',getbackFP.fingerprint);
    location.reload();
});
