var stun  = require('stun');
var net = require('net');
// STUN Server by Google
var port = 19302;
var loopback = "127.0.0.1";
var host = 'stun.l.google.com';
var msg = new Buffer("Hello!");
var HOST = '192.168.1.4';
var PORT = 2000;
// Connect to STUN Server
var client = stun.connect(port, host);
console.log("connected\n");
var ipaddress;
var clientport;


var client2 = stun.connect(port, host);


client.on('response', function(packet){
    console.log('Received STUN packet:', packet);

    // Save NAT Address
    if (packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS]) {
      ipaddress = packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS].address;
      clientport = packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS].port;

    } else {
          ipaddress = packet.attrs[stun.attribute.MAPPED_ADDRESS].address;
          clientport = packet.attrs[stun.attribute.MAPPED_ADDRESS].port;
    }

    console.log("address : "+ ipaddress);
    console.log("port : "+ clientport);


    console.log('Server listening on ' + HOST +':'+ PORT);
});

client.on('message', function(msg, rinfo){
    console.log('Received UDP message:', msg.toString());
});

client2.on('response', function(packet){
    console.log('Received STUN packet:', packet);

    // Save NAT Address
    if (packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS]) {
      ipaddress = packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS].address;
      clientport = packet.attrs[stun.attribute.XOR_MAPPED_ADDRESS].port;

    } else {
          ipaddress = packet.attrs[stun.attribute.MAPPED_ADDRESS].address;
          clientport = packet.attrs[stun.attribute.MAPPED_ADDRESS].port;
    }

    console.log("address : "+ ipaddress);
    console.log("port : "+ clientport);


    console.log('Server listening on ' + HOST +':'+ PORT);
});

client2.on('message', function(msg, rinfo){
    console.log('Received UDP message:', msg.toString());
});
// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection

    //client.send(msg, 0, msg.length, port, ipaddress);

    /*setTimeout(function(){
       client.close();
       console.log('done');
}, 2000);*/
// Sending STUN Packet


// net.createServer(function(sock) {
//
//     // We have a connection - a socket object is assigned to the connection automatically
//     console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
//
//     // Add a 'data' event handler to this instance of socket
//     sock.on('data', function(data) {
//
//         console.log('DATA ' + sock.remoteAddress + ': ' + data);
//         // Write the data back to the socket, the client will receive it as data from the server
//         sock.write('You said "' + data + '"');
//
//     });
//
//     // Add a 'close' event handler to this instance of socket
//     sock.on('close', function(data) {
//         console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
//     });
//
// }).listen(PORT, HOST);

const makeReq = () => {
  client.request(() => {});
  client2.request(() => {});
}

setInterval(makeReq, 1000);
