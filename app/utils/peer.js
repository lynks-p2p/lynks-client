
// const send_shred_request = require ('../../communication/client.js').send_shred_request;
// const send_store_request = require ('../../communication/client.js').send_store_request;
// const shredFile = require ('./file.js').shredFile;
// const readFileMap = require ('./file.js').readFileMap;
// const reconstructFile = require ('./file.js').reconstructFile;


import socketio from 'socket.io';
import socketclient from 'socket.io-client';
import dl from 'delivery';
import fs from 'fs';
import levelup from 'levelup';
import kad from 'kad';
import ip from 'ip'


import { sendShredHandler, getShredHandler } from './shred';


let node;

function initDHT(ip, port, networkID, seed, callback) {
  //MyIp , myID : strings
  //myPort : int, preferably 8080
  //mySeed is an object of that shape:-
                    //   const seed = [
                    //   'hostname_IDENTITY',
                    //   { hostname: 'hostname_IP', port: hostname_PORT }
                    // ];


  //TO DO:  use the hash(myID) and not the myID
  node = kad({
    transport: new kad.UDPTransport(),
    storage: levelup('./DHT_Storage/'),
    contact: { hostname: ip , port: port },
    identity: Buffer.from(networkID)
  });

  const logsOn = false;

  if (logsOn) {
    node.use((request, response, next) => {
      console.log('\n---------------------------------------------------------')
      console.log('## REQ')
      console.log(request)
      console.log('## RES')
      console.log(response)
      console.log('---------------------------------------------------------\n')

      next();
    });
  }

  node.listen(port, () => {
    node.join(seed, () => {
      console.log('Successfuly connected to Seed '+seed[1]['hostname']+':'+seed[1]['port']);
      callback()
    })
  });

}

function initFileDelivery(port, callback) {
  const io  = socketio.listen(port);
  // console.log('listening: '+ ip);

  const shredsStoredPath = './Storage/';

  io.sockets.on('connection', (socket) => {
    console.log('connected');

    socket.on('retrieve_shred', (data) => {
      console.log ('received a shred request!');
      sendShredHandler(socket, data.shredID, shredsStoredPath, () => {
        console.log('shred sent success');
      });
    });

    socket.on('store_shred', function (data) {
      console.log('received a store request!');
      getShredHandler(socket, data.shredID, shredsStoredPath, () => {
        console.log('shred stored success');
      });
    });

    socket.on('disconnect', function() {
      console.log('socket closed');
    });
  });

  callback();
}

function initHost( port, networkID, seed, callback) {
  initDHT( ip.address(), port, networkID, seed, () => {
    initFileDelivery(port, () => {
      callback();
    });
  });
}

function getPeers() {
  // get list of n best peers


  return 0;
}

function shred_and_send(public_ip, public_port, filename, filepath, key, NShreds, parity) {
  shredFile(filename, filepath + filename, key, NShreds, parity, (shredIDs)=>{
    console.log ('done shredding');
    send_store_request(public_ip, public_port, shredIDs, (path) => {
      var fs = require ('fs');
      for (var index in shredIDs) {
        fs.unlink(path + shredIDs[index], () => {});
      }
    });
  });
}

function receive_and_gather(public_ip, public_port, fileID, callback) {

  // CHANGE ME: parameterized shreds name, file sizes, number of shreds, targets length... etc.

  readFileMap((fileMap) => {
    const file = fileMap[fileID];
    if (file) {
      const shredIDs = file['shreds'];

      var shuffle = require('shuffle-array');
      var requiredShreds = [];
      for (var i=0; i<shredIDs.length; i++){
        requiredShreds.push(i);
      }
      shuffle(requiredShreds);
      requiredShreds = requiredShreds.slice(0, 10);

      var targets = 0x3FFFFFFF;
      // -1 ^ (3 << 30);
      console.log('intial targets' + targets.toString(2));
      // ~( target & 0);
      for (var i=0; i < requiredShreds.length; i++){
        // if (requiredShreds.indexOf(shredIDs[i]) >= 0) {
        targets ^= (1 << requiredShreds[i]);
        requiredShreds[i] = 'shred_' + requiredShreds[i]
        // }
      }
      console.log('targets: ' + targets.toString(2));
      console.log('chosen shreds: ' + requiredShreds);
      send_shred_request(public_ip, public_port, requiredShreds, (shredspath) => {
        reconstructFile(fileID, targets, shredIDs, shredspath, () => {
          callback();
        });
      });
    } else callback('error');
  });
}

export { node, getPeers, initHost, initFileDelivery, shred_and_send, receive_and_gather };
