// const kad = require('kad');

// import { fileToBuffer,
//    bufferToFile, compress, decompress, encrypt, decrypt, shredFile, recoverFile } from './app/utils/file';

function createID() {
  return 0;
}

function saveHost(node,key,shredID,hostID,callback) {

  //store (shred, host) in DHT`
    //node:KadmeilaNode
    //key: buffer
    //shredID,hostID : int

  const data= shredID+','+hostID

  node.iterativeStore(key, data, (err, numOfStored) => {
    if (err) return console.log(err);
    callback(err,numOfStored)

    });

}

function retrieveHosts(node,key,callback) {
  // load (shred, host) from DHT
    //node:KadmeilaNode
    //key: buffer

  node.iterativeFindValue(key, (err, value, contacts) => {
    if (err) return console.log(err);
    callback (value, contacts)
    }) ;

  }

export { createID, saveHost, retrieveHosts };
