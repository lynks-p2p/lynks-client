import ReedSolomon from 'reed-solomon';
import crypto from 'crypto';
import zlib from 'zlib';
import ObjectID from 'bson-objectid';
import { readFileMap, createFileMap, addFileMapEntry } from './file';
import kad from 'kad';


function generateShredID() { // generateShredID

   // const checkUniqueness = (key) => {
   //   retrieveHosts(key, (value) => {
   //     if (value.length != undefined) {
   //       // good key
   //       cb(key);
   //     }
   //     else {
   //       // key already exists
   //       console.log('key already in use')
   //       checkUniqueness(kad.utils.getRandomKeyString())
   //     }
   //   })
   // }

  //  checkUniqueness(kad.utils.getRandomKeyString());
  return kad.utils.getRandomKeyString();
}


function generateFileID(callback) {  // TODO: WHERE this will be called ?

    var key = crypto.randomBytes(16).toString('hex');  // generate random file key (128 bits)
    readFileMap((fileMap) => {
      while(fileMap[key] != undefined) { //  check if it's already in the filemap
        var key = crypto.randomBytes(16).toString('hex');
      }
    });
    return callback(key);
}

function generateFileMapKey(userid, pin, callback) { // TODO: what is this ?
    // hash userid with pin
    var key = crypto.createHash('SHA256').update(userid).update(pin).digest('hex');
    return callback(key);
  }

function generateMasterKey(FileMapKey, random, callback) {  // TODO: WHERE this will be called ?
  // salt the FileMapKey with a 32 bit string using hash
  var key = crypto.createHash('SHA256').update(FileMapKey).update(random).digest('hex');
  return callback(key);
}

function generateFileKey(MasterKey, FileID, callback) { // TODO: WHERE this will be called ?
  // hash MasterKey with FileID
  var key = crypto.createHash('SHA256').update(MasterKey).update(FileID).digest('hex');
  return callback(key);
}

export { generateShredID, generateFileID, generateFileKey, generateFileMapKey, generateMasterKey };