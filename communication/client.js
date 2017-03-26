const net = require('net');
const get_shreds = require ('./FileTransfer.js').get_shreds;
const send_shreds = require ('./FileTransfer.js').send_shreds;
const shredspath = './pre_send/';
const shredpath = './pre_store/';
module.exports = {
  send_shred_request : function(public_ip, public_port, shredIDs, callback) {   //get shreds back
    const socket  = require('socket.io-client')('http://'+ public_ip  +':'+ public_port);
    socket.emit('retrieve_shreds', { shredIDs: shredIDs });
    get_shreds(socket, shredIDs, shredpath, () => {
      callback(shredpath);
    });
  },
  send_store_request : function(public_ip, public_port, shredIDs, callback) {
    console.log ('http://'+ public_ip  +':'+ public_port);
    const socket  = require('socket.io-client')('http://'+ public_ip  +':'+ public_port);
    socket.emit('store_shreds', { shredIDs: shredIDs });
    send_shreds (socket, shredIDs, shredspath, () => {
    callback(shredspath);
    });
  }
};
