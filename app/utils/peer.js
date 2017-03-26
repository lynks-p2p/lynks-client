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

export { getPeers, shred_and_send, receive_and_gather };
