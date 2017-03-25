import ReedSolomon from 'reed-solomon';
import crypto from 'crypto';
import zlib from 'zlib';
import ObjectID from 'bson-objectid';

import fs from 'fs';

function createID() {
  return 0;
}

function getFileList() {
  return 0;
}

function fileToBuffer(path, callback) {
  fs.readFile(path, (err, data) => {
    if (err) return console.log(err);

    return callback(data);
  });
}

function bufferToFile(path, buffer, callback) {
  console.log('here');
  fs.writeFile(path, buffer, (err) => {
    if (err) return console.log(err);

    return callback();
  });
}

function compress(buffer, callback) {
  // compress file with zlib
  zlib.gzip(buffer, (err, data) => {
    if (err) return console.log(err);

    return callback(data);
  });
}

function decompress(buffer, callback) {
  // decompress file with zlib
  zlib.gunzip(buffer, (err, data) => {
    if (err) return console.log(err);

    return callback(data);
  });
}

function encrypt(buffer, key, callback) {
  const algorithm = 'aes-256-ctr';
  const password = key;
  const encryptVar = crypto.createCipher(algorithm, password);

  const out = Buffer.concat([encryptVar.update(buffer), encryptVar.final()]);

  return callback(out);
}

function decrypt(buffer, key, callback) {
  const algorithm = 'aes-256-ctr';
  const password = key;
  const decryptVar = crypto.createDecipher(algorithm, password);

  const out = Buffer.concat([decryptVar.update(buffer), decryptVar.final()]);

  return callback(out);
}

// inputFile is the path-name of the file to be shredded
// Parity is a multiple of the number of shreds in the original file
// The % of shreds we can lose is = (Parity/(Parity+1))*100
function erasureCode(inputBuffer, dataShreds, parity, callback) {
  // inputFile is the path-name of the file to be shredded
  // Parity is a multiple of the number of shreds in the original file
  // The % of shreds we can lose is = (Parity/(Parity+1))*100

  const dataBuffer = inputBuffer;
  const dataShards = dataShreds;
  const shardLength = Math.ceil(dataBuffer.length / dataShards); // shredLength;
  const parityShards = parity * dataShards;
  const totalShards = dataShards + parityShards;
  // Create the parity buffer
  const parityBuffer = Buffer.alloc(parityShards * shardLength);
  const bufferOffset = 0;
  const bufferSize = shardLength * totalShards;
  const shardOffset = 0;
  const shardSize = shardLength - shardOffset;

  const buffer = Buffer.concat([
    dataBuffer,
    parityBuffer
  ], bufferSize);

  const rs = new ReedSolomon(dataShards, parityShards);
  rs.encode(
    buffer,
    bufferOffset,
    bufferSize,
    shardLength,
    shardOffset,
    shardSize,
    (error) => {
      if (error) throw error;
      // Parity shards now contain parity data.
    }
  );

  const shredsList = [];
  console.log('total shards: '+totalShards);
  // writing data shards as files
  for (let i = 0; i < totalShards; i++) {
    // Generate shred IDs to name the shreds
    shredsList.push(buffer.slice(i * shardLength, (i + 1) * shardLength));
  }

  // return buffer
  //console.log ('shreds 1: '+shredsList);
  callback(shredsList, shardLength);
}

// shredsBuffer: a Buffer containing the shreds to be recovered,
// targets: a variable containing the indecies of the missing shreds
// dataShreds: Math.ceil(dataBuffer.length / shardLength)
// recoverdFile: the name of the file to be recovered
function erasureDecode(shredsBuffer, targets, parity, dataShreds, callback) {
  const buffer = new Buffer(shredsBuffer);
  const dataShards = dataShreds;
  const parityShards = parity * dataShards;
  const bufferOffset = 0;
  const totalShards = dataShards + parityShards;
  const shardLength = Math.ceil(buffer.length / totalShards); // shredLength;
  const bufferSize = shardLength * totalShards;
  const shardOffset = 0;
  const shardSize = shardLength - shardOffset;
  const rs = new ReedSolomon(dataShards, parityShards);

  rs.decode(
    buffer,
    bufferOffset,
    bufferSize,
    shardLength,
    shardOffset,
    shardSize,
    targets,
    (error) => {
      if (error) throw error;
    }
  );

  const dataLength = dataShards * shardLength;
  const restoredShreds = buffer.slice(bufferOffset, dataLength);

  callback(restoredShreds);
}



const fileMapPath = 'filemap.json';

function storeFileMap(fileMap, callback) {
  // store FileMap in specified filemap path
  fs.writeFileSync(fileMapPath, JSON.stringify(fileMap));
  callback();
}

function readFileMap(callback) {
  // load filemap from disk
  const fileMap = JSON.parse(fs.readFileSync(fileMapPath));
  callback(fileMap);
}

function createFileMap(callback) {
  // init file map
  const fileMap = {};
  storeFileMap(fileMap, ()=>{
  callback();
  });
}

function getFileMap() {
  // get FileMap from server, decrypt it
  // load FileMap into App runtime

  // optimization for future: only get hash of FileMap to check if local FileMap is up-to-date
}

function syncFileMap() {
  // update remote FileMap
  // 1. encrypt local FileMap
  // 2. make update request to server

  // optimization: have queue to manage file uploads and "batch" loggin into fileMap

}

function addFileMapEntry(fileID, fileMapEntry, callback) {
  readFileMap((fileMap) => {
    fileMap[fileID]  = fileMapEntry;
    storeFileMap(fileMap, () => {
      callback();
    });
  });
}

function removeFileMapEntry(fileID, callback) {
  // self-explanatory
  readFileMap((fileMap) => {
    fileMap[fileID] = undefined;
    storeFileMap(fileMap, () => {
      callback();
    });
  });
}

const pre_send_path = './pre_send';

function shredFile(filename, filepath, key, NShreds, parity, callback) {
  fileToBuffer(filepath, (loadedBuffer) => {
    compress(loadedBuffer, (compressedBuffer) => {
      encrypt(compressedBuffer, key, (encryptedBuffer) => {
        console.log(encryptedBuffer.length);
        erasureCode(encryptedBuffer, NShreds, parity, (shreds, shardLength) => {
          var shredIDs = [];
          const saveShreds = (index, limit) => {
            bufferToFile(`${pre_send_path}/shred_${index}`, shreds[index], () => {
              if (index < limit - 1) {
                saveShreds(index + 1, limit);
              }
              else {
                console.log ('limit: '+limit);
                for (var i=0 ; i < limit; i++)
                shredIDs.push('shred_'+i);
                readFileMap((fileMap) => {
                  const fileMapSize = Object.keys(fileMap).length;
                  const deadbytes = shreds[0].length * NShreds - encryptedBuffer.length;
                  const fileMapEntry = {
                    name: filename,
                    shreds: shredIDs,
                    key: key,
                    salt: 3463648646387,
                    parity: parity,
                    NShreds: NShreds,
                    shardLength: shardLength,
                    deadbytes: deadbytes
                  }
                  const lastFileID = [Object.keys(fileMap)[fileMapSize-1]];
                  console.log ('length: ' + lastFileID);
                  addFileMapEntry((lastFileID == '' ) ? 1 : parseInt(lastFileID) + 1, fileMapEntry, () => {
                  callback(shredIDs);
                  });
                });
              }
            });
          };

          const limit = shreds.length;

          saveShreds(0, limit);
        });
      });
    });
  });
}

function reconstructFile(fileID, shredsPath, callback) {
  let buffer = new Buffer([]);
  readFileMap((fileMap) => {
    const file = fileMap[fileID];
    const shredIDs = file['shreds'], key = file['key'], deadbytes = file['deadbytes'], NShreds = file['NShreds'], parity = file['parity'];
    const readShreds = (callback2) => {
      var counter = 0;
      for (var index in shredIDs) {
        fileToBuffer(shredsPath + shredIDs[index], (data) => {
          counter++;
          buffer = Buffer.concat([buffer, data]);
          if (counter == shredIDs.length) {
            callback2();
          }
        });
      }
    };
    readShreds(() => {
      console.log ('finishhh');
      readFileMap((fileMap) => {
        const filename = fileMap[fileID]['name'];
        if (!fileMap[fileID]) {
          console.log('error!!!');
          callback('error');
        }

        erasureDecode(buffer, 0, parity, NShreds, (loadedBuffer) => {
          console.log(loadedBuffer.length);
          const loadedBuffer2 = loadedBuffer.slice(0, loadedBuffer.length - deadbytes);
          decrypt(loadedBuffer2, key, (decryptedBuffer) => {
            decompress(decryptedBuffer, (decompressedBuffer) => {
              bufferToFile('./Downloads/' + filename, decompressedBuffer, () => {
                console.log('Success!');
                var fs = require ('fs');
                for (var index in shredIDs) {
                  console.log (shredsPath + shredIDs[index]);
                  fs.unlink(shredsPath + shredIDs[index], ()=>{});
                }
                callback();
              });
            });
          });
        });
      });
    });
  });
}

export {
  createID,
  fileToBuffer,
  bufferToFile,
  compress,
  decompress,
  erasureCode,
  erasureDecode,
  encrypt,
  decrypt,
  getFileList,
  createFileMap,
  getFileMap,
  syncFileMap,
  addFileMapEntry,
  removeFileMapEntry,
  readFileMap,
  shredFile,
  reconstructFile
   };
