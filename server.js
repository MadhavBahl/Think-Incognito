var express = require('express');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var path = require('path');
var socket = require('socket.io');
var mongoose = require('mongoose');

var port = process.env.PORT || 8080;
var app = express();
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'views')));

app.get('/',(req,res) => {
    res.render('index.hbs');
});

var server = app.listen(port);
console.log(`Server is up on port ${port}`);

var io = socket(server);

io.sockets.on('connection', (socket) => {
    console.log('New connection: ' + socket.id);

    socket.on('sendFP',(data) => {
        console.log(data);
        if(data.fingerprint == '2905388570' || data.fingerprint == '4237913925'){
            var sendback = {
                fp: data.fingerprint,
                status: 'Found'
            };
            console.log('sending back: ',sendback);
            io.sockets.emit('sendbackFP',sendback);
        } else {
            var sendback = {
                fp: data.fingerprint,
                status: 'Not Found'
            };
            console.log('changed ip ??');
            io.sockets.emit('sendbackFP',sendback);
        }
    });
});
