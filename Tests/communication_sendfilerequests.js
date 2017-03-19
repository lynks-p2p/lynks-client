var send_file_request = require ('../communication/server.js').send_file_request;
var map_port = require('../communication/PortForward.js').map_port;
var getPublicIP = require('../communication/stun.js').getPublicIP;

var public_ips = '127.0.0.1'; //testing locally for now
var private_port = 2345;
var public_port = 2345;   //testing locally for now
var filename = 'flash.jpg';
var filepath = '/home/james/Downloads/flash.jpg'

var filenames = [];
var filepaths = [];
filenames.push(filename);
filenames.push(filename+'1');
filenames.push(filename+'2');

filepaths.push(filepath);
filepaths.push(filepath+'1');
filepaths.push(filepath+'2');


getPublicIP((public_ip) =>{
  console.log('public ip: '+public_ip);
  map_port(private_port, public_port , (client) => {
    send_file_request(public_ips, public_port, filenames, filepaths);
  });
});
