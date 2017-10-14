var express = require('express');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var path = require('path');
var socket = require('socket.io');

var port = process.env.PORT || 8080;
var app = express();
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'views')));

app.get('/',(req,res) => {
    res.render('socket.hbs');
});

var server = app.listen(port);
console.log(`Server is up on port ${port}`);

var io = socket(server);
io.sockets.on('connection', function (socket) {
    console.log('WOW! A new connection was just made');
    console.log('New Connection: ' + socket.id);
});


// var io = socket(server);

// io.sockets.on('connection', newConnection);

// var newConnection = (socket) ={
    
// }