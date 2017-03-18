var net = require ("net");
var send_file = require ('../communication/FileTransfer.js').send_file;

module.exports = {
    send_file_request : function(public_ip, public_port, filename, filepath,callback) {
    var socket  = require('socket.io-client')('http://'+ public_ip  +':'+public_port);
    send_file (socket, filename, filepath,()=>{});
  }
};
