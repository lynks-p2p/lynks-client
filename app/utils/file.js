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

  // writing data shards as files
  for (let i = 0; i < totalShards; i += 1) {
    // Generate shred IDs to name the shreds
    shredsList.push(buffer.slice(i * shardLength, (i + 1) * shardLength));
    // fs.writeFileSync(`${i}_${Math.random()}`, buffer.slice(i * shardLength,
    // (i + 1) * shardLength));
  }

  // return buffer
  callback(shredsList);
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



const fileMapPath = 'filemap';

function storeFileMap(fileMap) {
  // store FileMap in specified filemap path
  fs.writeFileSync(fileMapPath, JSON.stringify(fileMap));
}

function readFileMap() {
  // load filemap from disk
  const fileMap = JSON.parse(fs.readFileSync(fileMapPath));
  return fileMap;
}

function createFileMap() {
  // init file map
  const fileMap = {};

  storeFileMap(fileMap);
  // file = {
  //   id:
  //   name:
  //   shreds: []
  //   salt:
  //   parity:
  //   dataShards:
  //   shredLength:
  // }
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

function addFileMapEntry(fileID, fileMapEntry) {
  const fileMap = readFileMap();

  fileMap[fileID] = fileMapEntry;

  storeFileMap(fileMap);

  // self-explanatory
  // file = {
 //   name:
 //   shreds: []
 //   salt:
 //   parity:
 //   dataShards:
 //   shredLength:
 // }
}

function removeFileMapEntry(fileID) {
  // self-explanatory
  const fileMap = readFileMap();

  fileMap[fileID] = undefined;

  storeFileMap(fileMap);
}


const NShreds = 10;
const parity = 2;
// const key = '123key';
// const input='Jon.mp4';
const output='new_flash.jpg';
// const deadbytes = 6;

function shredFile(filename, key, callback) {
  fileToBuffer(filename, (loadedBuffer) => {
    compress(loadedBuffer, (compressedBuffer) => {
      encrypt(compressedBuffer, key, (encryptedBuffer) => {
        console.log(encryptedBuffer.length);
        erasureCode(encryptedBuffer, NShreds, parity, (shreds) => {

          const saveShreds = (index, limit) => {
            bufferToFile(`./tmp/shred_${index}`, shreds[index], () => {
              if (index < limit - 1) saveShreds(index + 1, limit);
              else {
                createFileMap();
                
                const deadbytes = shreds[0].length * NShreds - encryptedBuffer.length;
                console.log('deadbytes: ' + deadbytes);
                callback();
              }
            });
          };

          const limit = shreds.length;

          saveShreds(0, limit);
        });
      });
    });
  });
};

function reconstructFile (shredsPaths, key, deadbytes, callback) {
  let buffer = new Buffer([]);

  const readShreds = (index, limit, callback2) => {
    fileToBuffer(shredsPaths[index], (data) => {
      buffer = Buffer.concat([buffer, data]);
      if (index < limit - 1) readShreds(index + 1, limit, callback2);
      else {
        callback2();
      }
    });
  };

  const limit = shredsPaths.length;

  readShreds(0, limit, () => {
    erasureDecode(buffer, 0, parity, NShreds, (loadedBuffer) => {
      console.log(loadedBuffer.length);
      const loadedBuffer2 = loadedBuffer.slice(0, loadedBuffer.length - deadbytes);
      decrypt(loadedBuffer2, key, (decryptedBuffer) => {
        decompress(decryptedBuffer, (decompressedBuffer) => {
          bufferToFile(output, decompressedBuffer, () => {
            console.log('Success!');
            callback();
          });
        });
      });
    });
  });
};

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
  shredFile,
  reconstructFile
   };
