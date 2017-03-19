var net = require ("net");
var send_file = require ('../communication/FileTransfer.js').send_file;

module.exports = {
    handle_requests : function(private_port, callback) {
      const io  = require('socket.io').listen(private_port);
      console.log('listening: '+private_port);
      io.sockets.on('connection', function(socket) {
        console.log('connected');
        socket.on('file_request', function (data) {
          console.log ('received a file request!');
          send_file (socket, data['filenames'], data['filepaths'],()=>{
          callback();
          });
        });
      });
    }
};
