var express = require('express');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var path = require('path');
var socket = require('socket.io');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/thinkincognito');
var port = process.env.PORT || 8080;
var app = express();
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'views')));

var Schema = mongoose.Schema;
var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    fingerprint: {
        type: String,
        required: true
    }
})

var User = mongoose.model('User',userSchema);

var server = app.listen(port);
console.log(`Server is up on port ${port}`);

app.get('/',(req,res) => {
    res.render('index.hbs');
});

var io = socket(server);

io.sockets.on('connection', (socket) => {
    console.log('New connection: ' + socket.id);

    socket.on('sendDataFP',(userData) => {
        console.log('Data recieved for the user ',userData.name);
        var newUser = new User(userData);
        newUser.save()
          .then((doc) => {
            console.log('The data was saved: ',doc);
          })
          .catch((e) => {
              console.log('Error: ',e);
          });
        io.sockets.emit('sendbackDataFP',userData);
    });

    socket.on('forgetSentData',(getbackData) => {
        User.findOneAndRemove({'fingerprint': getbackData.fingerprint},(err,backData) => {
            if(err) {
                console.log('Could not delete the given record',err);
            } else {
                console.log('Record deleted',backData);
                io.sockets.emit('deletedFP',getbackData);
            }
        });
    });

    socket.on('sendFP',(data) => {
        console.log(data);
        // if(data.fingerprint == '2905388570' || data.fingerprint == '4237913925'){
        //     var sendback = {
        //         fp: data.fingerprint,
        //         status: 'Found'
        //     };
        //     console.log('sending back: ',sendback);
        //     io.sockets.emit('sendbackFP',sendback);
        // } else {
        //     var sendback = {
        //         fp: data.fingerprint,
        //         status: 'Not Found'
        //     };
        //     console.log('changed ip ??');
        //     io.sockets.emit('sendbackFP',sendback);
        // }

        User.findOne({ 'fingerprint': data.fingerprint})
          .then((doc) => {
            console.log('The user was found: ',doc);
            if(doc != 'null') {
                var sendback = {
                    name: doc.name,
                    fingerprint: data.fingerprint,
                    status: 'Found'
                };
                io.sockets.emit('sendbackFP',sendback);
            } else {
                var sendback = {
                    fingerprint: data.fingerprint,
                    status: 'Not Found'
                };
                io.sockets.emit('sendbackFP',sendback);
            }
          })
          .catch((e) => {
            var sendback = {
                fingerprint: data.fingerprint,
                status: 'Not Found'
            };
            io.sockets.emit('sendbackFP',sendback);
          });
    });
});
