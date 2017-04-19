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
    if (err){
      console.log(err);
      console.log("aaaaaaaaaaa");
      return callback(err, null, null)
    }
    callback (null,value, contacts)
  }) ;


}

function sendShredHandler(socket, shredID, shredsPath, callback) { // steup for sending shreds
  const delivery = dl.listen(socket);
  delivery.connect();

  delivery.on('delivery.connect', (delivery) => {

    // for (var i=0; i < shredIDs.length; i++) {
    delivery.send({
      name: shredID,
      path: shredsPath + shredID
    });
    // }
    delivery.on('send.success', () => {
      console.log('A shred was sent successfully!');
      callback();
    });
  });
}

function getShredHandler(socket, shredID, shredsPath, callback) { // steup for recieving shreds
  // console.log('listening to receive ...');

  const delivery = dl.listen(socket);

  delivery.on('receive.success', (shred) => {
    fs.writeFile(shredsPath + shred.name, shred.buffer, (err) => {
      socket.disconnect();
      if (err) {
        console.log('shred could not be saved: ' + err);
        callback(err);
      } else {
        console.log('shred ' + shred.name + ' saved');
        callback();
      }
    });
  });
}

function storeShredRequest(ip, port, shredID, shredsPath, callback) { // send a shred TO  a Peer
  const socket = socketclient(`http://${ip}:${port}`);

  socket.emit('store_shred', { shredID });

  // steup for sending shreds
  sendShredHandler(socket, shredID, shredsPath, (err) => {
    if (err) return console.log(err);
    callback();
  });
}

function getShredRequest(ip, port, shredID, shredsPath, callback) {// receive a shred FROM a Peer
  const socket = socketclient(`http://${ip}:${port}`);

  socket.emit('retrieve_shred', { shredID });

  // steup for recieving shreds
  getShredHandler(socket, shredID, shredsPath, (err) => {
    if (err) return console.log(err);
    callback();
  });
}


export { generateShredID, saveHost, retrieveHosts, sendShredHandler, getShredHandler, storeShredRequest, getShredRequest };
