import ReedSolomon from 'reed-solomon';
import crypto from 'crypto';
import zlib from 'zlib';
import ObjectID from 'bson-objectid';
import { readFileMap, createFileMap, addFileMapEntry } from './file';



function generateFileID(callback) {

  // generate random file key (128 bits)
  var key = crypto.randomBytes(16).toString('hex');

  var fileMap = readFileMap();

  // check if it's already in the filemap
  while(fileMap[key]!=undefined)
  {
    var key = crypto.randomBytes(16).toString('hex');
    console.log('1');
  }

  console.log('2');
  return callback(key);
}

function generateFileMapKey(userid, pin, callback) {

  // hash userid with pin
  var key = crypto.createHash('SHA256').update(userid).update(pin).digest('hex');
  return callback(key);
}

function generateMasterKey(FileMapKey, callback) {

  // salt the FileMapKey with a 32 bit string using hash
  var key = crypto.createHash('SHA256').update(FileMapKey).update(crypto.randomBytes(4).toString('hex')).digest('hex');
  return callback(key);
}

function generateFileKey(MasterKey, FileID, callback) {

  // hash MasterKey with FileID
  var key = crypto.createHash('SHA256').update(MasterKey).update(FileID).digest('hex');
  return callback(key);
}

// generateFileID(    (mykey)=>{
//   console.log(mykey);
// });

// generateFileMapKey( 'ahmad_adel', '12345', (mykey)=>{
//   console.log(mykey);
// });

generateFileKey( 'ahmad_adel', '135yw534ws6y34', (mykey)=>{
  console.log(mykey);
});
