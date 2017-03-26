const kad = require('kad');
import {node}  from './peer';

function generateShredID(cb) {

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

   checkUniqueness(kad.utils.getRandomKeyString());
}

function saveHost(shredID,hostID,callback) {

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

function retrieveHosts(key, callback) {
  // load (shred, host) from DHT
    //node:KadmeilaNode
    //key: buffer
  node.iterativeFindValue(key, (err, value, contacts) => {
    if (err) return console.log(err);
    callback (value, contacts)
  }) ;


}

export { generateShredID, saveHost, retrieveHosts };
