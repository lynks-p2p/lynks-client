const send_shred_request = require ('../../communication/client.js').send_shred_request;
const send_store_request = require ('../../communication/client.js').send_store_request;
const shredFile = require ('./file.js').shredFile;
const readFileMap = require ('./file.js').readFileMap;
const reconstructFile = require ('./file.js').reconstructFile;
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
    }
    else callback('error');
  });
}

export { getPeers, shred_and_send, receive_and_gather };
