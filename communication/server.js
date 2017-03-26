const net = require ("net");
const send_shreds = require ('./FileTransfer.js').send_shreds;
const get_shreds = require ('./FileTransfer.js').get_shreds;

module.exports = {
    handle_requests : function(private_port, callback) {
      const io  = require('socket.io').listen(private_port);
      console.log('listening: '+private_port);
      io.sockets.on('connection', function(socket) {
        console.log('connected');
        socket.on('retrieve_shreds', function (data) {
          console.log ('received a shred request!');
          send_shreds(socket, data['shredIDs'], './Storage/', ()=>{
            callback();
          });
        });
        socket.on('store_shreds', function (data) {
          console.log('received a store request!');
          get_shreds(socket, data['shredIDs'], './Storage/', ()=>{
            callback();
          });
        });
      });
    }
};
