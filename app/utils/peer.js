
const send_shred_request = require ('../../communication/client.js').send_shred_request;
const send_store_request = require ('../../communication/client.js').send_store_request;
const shredFile = require ('./file.js').shredFile;
const readFileMap = require ('./file.js').readFileMap;
const reconstructFile = require ('./file.js').reconstructFile;
import socketio from 'socket.io';
import socketclient from 'socket.io-client';
import dl from 'delivery';
import ip from 'ip'
import fs from 'fs';
const levelup = require('levelup');
const kad = require('kad');



let node;

function intializeDHT(myPort, myID, mySeed, callback){
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
    contact: { hostname: ip.address() , port: myPort },
    identity: Buffer.from(myID)
  });

  // node.use((request, response, next) => {
  //   console.log('\n---------------------------------------------------------')
  //   console.log('## REQ')
  //   console.log(request)
  //   console.log('## RES')
  //   console.log(response)
  //   console.log('---------------------------------------------------------\n')
  //
  //   next();
  // });


  node.listen(myPort, () => {
    node.join(mySeed, () => {
      console.log('Successfuly connected to Seed '+mySeed[1]['hostname']+':'+mySeed[1]['port']);
      callback()
    })
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
  readFileMap((fileMap) => {
    const file = fileMap[fileID];
    if (file) {
      const shredIDs = file['shreds'];
      send_shred_request(public_ip, public_port, shredIDs, (shredspath) => {
        reconstructFile(fileID, shredspath, () => {
          callback();
        });
      });
    }
    else callback('error');
  });
}


export { getPeers, shred_and_send, receive_and_gather,intializeDHT,node };