//client.js
var io = require('socket.io-client');
const quasar = require('kad-quasar');
import ip from 'ip'

import { initHost, node } from '../app/utils/peer';

const myport = 8080;
const networkID = 'ISTHISEVENABROKERYO?';

const seed = [
  Buffer.from('ISTHISEVENABROKERYO?').toString('hex'),
  { hostname: ip.address(), port: 8080 }
];

initHost(myport, networkID, seed, () => {
    console.log('initiated host');
});



// var socket = io.connect('http://localhost:3000');   //, {reconnect: true}
//
// // Add a connect listener
// socket.on('connect', function (socket) {
//     console.log('Connected!');
// });
//
// socket.on('send.success', (yo) => {
//   console.log(yo);
//   socket.disconnect();
// });
//
// //socket.emit('subscriber', 'me', 'test msg');
//
// socket.emit('subscriber', 'me', 'test msg');
