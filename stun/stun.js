var stun  = require('stun');

// STUN Server by Google
var port = 19302;
var host = 'stun.l.google.com';

// Connect to STUN Server
var client = stun.connect(port, host);
console.log("connected\n");
client.on('response', function(packet){
    console.log('Received STUN packet:', packet);

    // Save NAT Address
    if (packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS]) {
        console.log("address : "+packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS].address);
        console.log("port : "+packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS].port);
    } else {
          console.log("address 2: "+packet.attrs[stun.attribute.MAPPED_ADDRESS]);
    }


});
// Sending STUN Packet
client.request(()=>{});
