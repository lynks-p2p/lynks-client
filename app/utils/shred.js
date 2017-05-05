import kad from 'kad';
import dl from 'delivery';
import fs from 'fs';
import socketclient from 'socket.io-client';
var ind=0;
import { node } from './peer';
const maxUploadSize = 200000000;
const maxDownloadSize = 200000000;
var currentUploadSize = 0;
var currentDownloadSize = 0;
function saveHost(shredID,hostID,callback) { //  function to save the shred-host pair on the DHT


  //store (shred, host) in DHT`
    //node:KadmeilaNode
    //shredID,hostID : int

  // const data= shredID+','+hostID

  //the the shredId is the key. the key must be a 160 bits or 20 Bytes
  //the data is the hostID


  node.iterativeStore(shredID, hostID, (err, numOfStored) => {
    if (err) {return callback(err,null);}
    callback(null,numOfStored);

    });

}

function retrieveHosts(key, callback) { //  function to retrieve a shred-host pair on the DHT


  // load (shred, host) from DHT
    //node:KadmeilaNode
    //key: buffer
  node.iterativeFindValue(key, (err, value, contacts) => {
    if (err){
      console.log(err);
      return callback(err, null, null)
    }
    callback (null,value, contacts)
  }) ;


}

function sendShredHandler(socket, shredID, shredsPath, callback) { // setup for sending shreds
  const delivery = dl.listen(socket);
  delivery.connect();
  delivery.on('delivery.connect', (delivery) => {
    let filepath = shredsPath + shredID;
    let stats = fs.statSync(filepath);
    if (currentUploadSize > maxUploadSize){
      console.log('too much!');
      socket.emit('shred_retrieve_fail');
    }
    currentUploadSize += stats.size;
    if (fs.existsSync(filepath)) {
      delivery.send({
        name: shredID,
        path: filepath
      })
    } else {
      console.log('\ta shred no longer exists here\n');
      socket.emit('shred_retrieve_fail');
    }
    delivery.on('send.success', () => {
      currentUploadSize -= stats.size;
      console.log('\tA shred was sent successfully!' + ind++);
      return callback(null);
    });
  });
}

function getShredHandler(socket, shredID, shredsPath, callback) { // setup for recieving shreds
  // console.log('listening to receive ...');
  if (currentDownloadSize > maxDownloadSize ){
    socket.emit('shred_retrieve_fail');
  }
  const delivery = dl.listen(socket);

  delivery.on('receive.success', (shred) => {
    let filepath = shredsPath + shredID;
    let stats = fs.statSync(filepath);
    currentDownloadSize += stats.size;
    fs.writeFile(shredsPath + shred.name, shred.buffer, (err) => {
      socket.disconnect();
      currentDownloadSize -= stats.size;
      if (err) {
        console.log('\tshred could not be saved: ' + err);
        return callback(err);
      } else {
        console.log('\tshred ' + shred.name + ' saved');
        return callback(null);
      }
    });
  });
}

function storeShredRequest(ip, port, shredID, shredsPath, callback) { // send a shred TO  a Peer

  const socket = socketclient(`http://${ip}:${port}`);
  socket.on('connect_error', function() {
      socket.disconnect();
      return callback('\tcould not connect to '+ip+':'+port);
   });
  socket.emit('store_shred', { shredID });
  socket.on('shred_retrieve_fail', function() {
      // console.log('\tfailed to retrieve a shred '+shredID);
      socket.disconnect();
      return callback('\tfailed to retrieve a shred '+shredID);
   });
  // steup for sending shreds
  sendShredHandler(socket, shredID, shredsPath, (err) => {
    if (err) return callback(err);
    else return callback(null);
  });
}

function getShredRequest(ip, port, shredID, shredsPath, callback) {// receive a shred FROM a Peer
  const socket = socketclient(`http://${ip}:${port}`);
  socket.on('connect_error', function() {
      // console.log('\tcould not connect');
      socket.disconnect();
      return callback('\tcould not connect to '+ip+':'+port);
   });
  socket.emit('retrieve_shred', { shredID });
  socket.on('shred_retrieve_fail', function() {
      // console.log('\tfailed to retrieve a shred '+shredID);
      socket.disconnect();
      return callback('\tfailed to retrieve a shred '+shredID);
   });
  // steup for recieving shreds
  getShredHandler(socket, shredID, shredsPath, (err) => {
    if (err) return callback(err);
    callback(null);
  });
}


export { saveHost, retrieveHosts, sendShredHandler, getShredHandler, storeShredRequest, getShredRequest };
