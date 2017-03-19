var net = require('net');
var listen_file = require ('./FileTransfer.js').listen_file;

module.exports = {
  send_file_request : function(public_ip, public_port, filenames, filepaths) {
    var socket  = require('socket.io-client')('http://'+ public_ip  +':'+ public_port);
    listen_file(socket, filenames, filepaths);
  }
};
