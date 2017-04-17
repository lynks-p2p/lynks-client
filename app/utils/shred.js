import kad from 'kad';
import dl from 'delivery';
import fs from 'fs';
import socketclient from 'socket.io-client';

import { node } from './peer';

function generateShredID(cb) { // generateShredID

   const checkUniqueness = (key) => {
     retrieveHosts(key, (value) => {
       if (value.length != undefined) {
         // good key
         cb(key);
       }
       else {
         // key already exists
         console.log('key already in use')
         checkUniqueness(kad.utils.getRandomKeyString())
       }
     })
   }

  //  checkUniqueness(kad.utils.getRandomKeyString());
  cb (kad.utils.getRandomKeyString());
}

function saveHost(shredID,hostID,callback) { //  function to save the shred-host pair on the DHT


  //store (shred, host) in DHT`
    //node:KadmeilaNode
    //shredID,hostID : int

  // const data= shredID+','+hostID

  //the the shredId is the key. the key must be a 160 bits or 20 Bytes
  //the data is the hostID


  node.iterativeStore(shredID, hostID, (err, numOfStored) => {
    if (err) return console.log(err);
    callback(err,numOfStored);

    });

}

function retrieveHosts(key, callback) { //  function to retrieve a shred-host pair on the DHT


  // load (shred, host) from DHT
    //node:KadmeilaNode
    //key: buffer
  node.iterativeFindValue(key, (err, value, contacts) => {
    if (err) return console.log(err);
    callback (err,value, contacts)
  }) ;


}

function sendShredHandler(socket, shredID, shredsPath, callback) { // setup for sending shreds
  const delivery = dl.listen(socket);
  delivery.connect();
  delivery.on('delivery.connect', (delivery) => {
    const filepath = shredsPath + shredID;
    if (fs.existsSync(filepath)) {
      delivery.send({
        name: shredID,
        path: filepath
      })
    } else {
      console.log('a shred no longer exists here\n');
      socket.emit('shred_retrieve_fail');
    }
    delivery.on('send.success', () => {
      console.log('A shred was sent successfully!');
      callback();
    });
  });
}

function getShredHandler(socket, shredID, shredsPath, callback) { // setup for recieving shreds
  // console.log('listening to receive ...');

  const delivery = dl.listen(socket);

  delivery.on('receive.success', (shred) => {
    fs.writeFile(shredsPath + shred.name, shred.buffer, (err) => {
      socket.disconnect();
      if (err) {
        console.log('shred could not be saved: ' + err);
        return callback(err);
      } else {
        console.log('shred ' + shred.name + ' saved');
        return callback(0);
      }
    });
  });
}
var x=0;
function storeShredRequest(ip, port, shredID, shredsPath, callback) { // send a shred TO  a Peer
  console.log('connecting to: '+ip+':'+port);
  const socket = socketclient(`http://${ip}:${port}`);
  socket.on('connect_error', function() {
      socket.disconnect();
      return callback(1);
   });
  socket.emit('store_shred', { shredID });
  socket.on('shred_retrieve_fail', function() {
      console.log('failed to retrieve a shred');
      socket.disconnect();
      return callback(2);
   });
  // steup for sending shreds
  sendShredHandler(socket, shredID, shredsPath, (err) => {
    if (err) return console.log(err);
    else return callback(0);
  });
}

function getShredRequest(ip, port, shredID, shredsPath, callback) {// receive a shred FROM a Peer
  const socket = socketclient(`http://${ip}:${port}`);
  socket.on('connect_error', function() {
      console.log('couldnt connect');
      socket.disconnect();
      return callback(1);
   });
  socket.emit('retrieve_shred', { shredID });
  socket.on('shred_retrieve_fail', function() {
      console.log('failed to retrieve a shred');
      socket.disconnect();
      return callback(2);
   });
  // steup for recieving shreds
  getShredHandler(socket, shredID, shredsPath, (err) => {
    if (err) return console.log(err);
    else return callback(0);
  });
}


export { generateShredID, saveHost, retrieveHosts, sendShredHandler, getShredHandler, storeShredRequest, getShredRequest };
