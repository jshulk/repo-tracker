var http = require('http') 
  , logger = require("../logger")
  , Socket = require('../socket')
  , Subscriber = require('../cache/subscriber')
  , subscriber = new Subscriber();

function SocketHandler(httpServer) {

  var socketIo = new Socket(httpServer);

  socketIo.on('connection', function(socket) {
    subscriber.subscribe("issues");
    subscriber.subscribe("commits");

    subscriber.client.on("message", function (channel, message) {
        console.log('on message');
      socket.emit(channel, JSON.parse(message));
    });

    socket.on('subscribe', function (data) {
      socket.join(data.channel);
    });

    socket.on('unsubscribe', function (data) {
      socket.leave(data.channel);
    });

  });

  socketIo.on('error', function() { 
    logger.error(arguments);
  });

    return socketIo;

}

module.exports = SocketHandler;