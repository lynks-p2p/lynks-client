var stun  = require('stun');
var net = require('net');

var port = 19302;
var host = 'stun.l.google.com';  //google's stun server
var public_ip;

module.exports = {
  getPublicIP : function  (callback){
  var client = stun.connect(port, host);
  client.request(() => {});
  client.on('response', function(packet){
      console.log('Received packet from stun server:', packet);
      var xor_address = packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS];
      var normal_address = packet.attrs[stun.attribute.MAPPED_ADDRESS];
      public_ip = xor_address ? xor_address.address : normal_address.address;
      console.log("my public ip addressss : " + public_ip);
      return callback(public_ip);
    });
  }
};
