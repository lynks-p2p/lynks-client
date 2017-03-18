var send_file_request = require ('../communication/client.js').send_file_request;
var public_ip = '127.0.0.1'; //testing locally for now
var public_port = 12345;   //testing locally for now
var filename = 'flash.jpg';
var filepath = '/home/james/Downloads/flash.jpg'

for (var i=0;i<100;i++)
send_file_request( public_ip, public_port, filename+'1', filepath+'1');
