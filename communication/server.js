var net = require('net');
var getPublicIP = require ('./stun/stun.js').getPublicIP;
var map_port = require ('./PortForward.js').map_port;
var unmap_port = require ('./PortForward.js').unmap_port;
var listen_file = require ('./FileTransfer.js').listen_file;

module.exports = {
  handle_requests : function(private_port) {
    var io  = require('socket.io').listen(private_port);
    io.sockets.on('connection', function(socket) {
        socket.on('file_request', function (data) {
          listen_file(socket);
      });
    });
  }
};
