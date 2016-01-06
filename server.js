var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(8080).sockets;
console.log('socket.io listening');



mongo.connect('mongodb://localhost/chat', function(err, db) {
    if (err) throw err;
    console.log('db ready');


    client.on('connection', function(socket) {
        console.log('someone has connected');

        var col = db.collection('messages');

        col.find().limit(100).sort({
            _id: 1
        }).toArray(function(err, res) {
            if (err) throw err;

            socket.emit('output', res);
        });

        function sendStatus(s) {
            socket.emit('status', s);
        }

        socket.on('input', function(data) {
            console.log(data);
            var name = data.name;
            var message = data.message;
            var whitespacePattern = /^\s*$/
            if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
                console.log('invalid');
                sendStatus({
                    message: 'Name and Message is required',
                    clear: false
                });
            } else {
                col.insert({
                    name: name,
                    message: message
                }, function() {
                    sendStatus({
                        message: 'Message Sent',
                        clear: true
                    });

                    //emit latest message to all clients
                    //
                    client.emit('output', [data]);
                });
            }
        });

    });
});
