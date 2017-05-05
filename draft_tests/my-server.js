//server.js

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const quasar = require('kad-quasar');
import ip from 'ip'

import { sortHosts, initHost, initHost2, node, getPeers } from './app/utils/peer';

const myport = 1337;
const networkID = 'YEHIA_HESHAM_SAIDAUC';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: ip.address(), port: 8080 }            // change into seed's id
];




initHost(myport, networkID, seed, () => {
    getPeers((hosts)=>{
        console.log(hosts);
    });
});


// io.on('connection', function (socket){
//     console.log('connection');
//
//     socket.on('subscriber', function (from, msg) {
//         console.log('MSG', from, ' saying ', msg);
//         socket.emit('send.success', 'damn son');
//         counter++;
//         console.log(counter);
//         if(counter==3)
//         {
//             console.log('should disconnect now');
//             http.close();
//         }
//     });
//
// });
//
// http.listen(3000, function () {
//   console.log('listening on *:3000');
// });
//
// setTimeout(function () {
//   console.log('timeout!!!!!!');
//   http.close();
// }, 10000)
