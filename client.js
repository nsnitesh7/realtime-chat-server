;
(function() {
    //get required nodes
    function getNode(s) {
        return document.querySelector(s);
    };
    var textarea = getNode('.chat-textarea');
    var chatName = getNode('.chat-name');
    var statusDisplay = getNode('.chat-status');
    var messages = getNode('.chat-messages');

    var defaultStatus = statusDisplay.textContent;

    function setStatus(s) {
        statusDisplay.textContent = s.message;
        console.log(s.clear);
        if (s.clear) {
            textarea.value = '';
        }
        setTimeout(function() {
            statusDisplay.textContent = defaultStatus;
        }, 5000);

    }


    try {
        var socket = io.connect('http://chatserver007.cloudapp.net:8080');
    } catch (e) {
        console.error(e);
        //set display status
    }
    if (socket) {
        console.log('socket ok');

        socket.on('status', function(s) {
            setStatus(s);
        });

        socket.on('output', function(data) {
            console.log(data);
            if (data.length) {
                //loop through the results
                for (var i = 0; i < data.length; i++) {
                    var message = document.createElement('div');
                    message.setAttribute('class', 'chat-message');
                    message.textContent = data[i].name + ': ' + data[i].message;

                    //append to messages list
                    messages.appendChild(message);
                    messages.insertBefore(message, messages.firstChild);
                }
            }
        });


        textarea.addEventListener('keydown', function(event) {

            if (event.which === 13 && event.shiftKey === false) {
                console.log('send');
                socket.emit('input', {
                    name: chatName.value,
                    message: textarea.value
                });
            }

        });
    }
})();
