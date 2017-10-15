var client = new ClientJS(); // Create A New Client Object
var fingerprint = client.getFingerprint(); // Get Client's Fingerprint
var fp = document.getElementById('fp');

var socket = io.connect('http://localhost:8080');
var data = {fingerprint: fingerprint};

console.log('sending: ' + fingerprint);
socket.emit('sendFP',data);
console.log('Sent: ',data);

socket.on('sendbackFP',(sendback) => {
    console.log('WOW I AM RECIEVING MSG');
    console.log('The message from the server is: ',sendback.status);

    if(sendback.status === 'Found') {
        fp.innerHTML = `The digital fingerprint is: ${sendback.fp}`;
    }
});
