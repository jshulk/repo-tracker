var http = require('http') 
  , logger = require("../logger")
  , Socket = require('../socket')
  , Subscriber = require('../cache/subscriber')
  , SessionSockets = require('session.socket.io')
  , subscriber = new Subscriber();

function SocketHandler(httpServer, sessionStore, cookieParser) {

  var socketIo = new Socket(httpServer);
 var sessionSockets = new SessionSockets(socketIo, sessionStore, cookieParser);
    
  sessionSockets.on('connection', function(socket) {
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

  sessionSockets.on('error', function() { 
    logger.error(arguments);
  });

    return socketIo;

}

module.exports = SocketHandler;