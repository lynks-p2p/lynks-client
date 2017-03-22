const shred_and_send = require ('../app/utils/peer.js').shred_and_send;

const public_ip = '192.168.1.4'; //testing locally for now

const public_port = 2345;   //testing locally for now
const filename = 'flash.jpg';
const filepath = '/home/james/Downloads/'

shred_and_send(public_ip, public_port, filename, filepath);
