const send_shred_request = require ('../communication/server.js').send_shred_request;
const send_store_request = require ('../communication/server.js').send_store_request;
const map_port = require('../communication/PortForward.js').map_port;
const getPublicIP = require('../communication/stun.js').getPublicIP;

const public_ips = '127.0.0.1'; //testing locally for now
const private_port = 2345;
const public_port = 2345;   //testing locally for now
const shredname = 'flash.jpg';
const shredpath = '/home/james/Downloads/'

var shredIDs = [];

shredIDs.push(shredname);
shredIDs.push(shredname+'1');
shredIDs.push(shredname+'2');


getPublicIP((public_ip) =>{
  console.log('public ip: '+public_ip);
  map_port(private_port, public_port , (client) => {
    //send_shred_request(public_ips, public_port, shredIDs, ()=>{});
    send_store_request(public_ips, public_port, shredIDs, shredpath, ()=>{});
  });
});
