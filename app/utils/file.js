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

function compress(filepath, callback) {
  // compress file with zlib
  const gzip = zlib.createGzip();
  const newfilepath = `${filepath}.Gzip`;
  const decompressedfile = fs.createReadStream(filepath);
  const compressedfile = fs.createWriteStream(newfilepath);
  decompressedfile.pipe(gzip).pipe(compressedfile);
  if (callback) {
    decompressedfile.on('end', callback);
  }
  // return compressed file name
  return newfilepath;
}

function decompress(filepath, callback) {
  // decompress file with zlib
  const gunzip = zlib.createGunzip();
  let newfilepath;
  if (filepath.indexOf('_decrypted') > -1) {
    newfilepath = `${filepath.substr(0, filepath.length - 10)}_copy.jpg`;
  } else {
    newfilepath = `${filepath}_copy.jpg`;
  }
  const compressedfile = fs.createReadStream(filepath);
  const decompressedfile = fs.createWriteStream(newfilepath);
  compressedfile.pipe(gunzip).pipe(decompressedfile);
  fs.unlinkSync(filepath);
  if (callback) {
    compressedfile.on('end', callback);
  }
  // return decompressed file name
  return newfilepath;
}

function encrypt(filepath, key, callback) {
  const algorithm = 'aes-256-ctr';
  const password = key;
  let newfilepath;
  if (filepath.indexOf('.Gzip') > -1) {
    newfilepath = `${filepath.substr(0, filepath.length - 5)}_encrypted`;
  } else {
    newfilepath = `${filepath}_encrypted`;
  }
  const encryptVar = crypto.createCipher(algorithm, password);
  const compressedfileRead = fs.createReadStream(filepath);
  const compressedfileWrite = fs.createWriteStream(newfilepath);
  compressedfileRead.pipe(encryptVar).pipe(compressedfileWrite);
  fs.unlinkSync(filepath);
  if (callback) {
    compressedfileRead.on('end', callback);
  }
  // return encrypted file name
  return newfilepath;
}

function decrypt(filepath, key, callback) {
  const algorithm = 'aes-256-ctr';
  const password = key;
  let newfilepath;
  if (filepath.indexOf('_encrypted') > -1) {
    newfilepath = `${filepath.substr(0, filepath.length - 10)}_decrypted`;
  } else {
    newfilepath = `${filepath}_decrypted`;
  }
  const decryptVar = crypto.createDecipher(algorithm, password);
  const compressedfileRead = fs.createReadStream(filepath);
  const compressedfileWrite = fs.createWriteStream(newfilepath);
  compressedfileRead.pipe(decryptVar).pipe(compressedfileWrite);
  fs.unlinkSync(filepath);
  if (callback) {
    compressedfileRead.on('end', callback);
  }
  // return decrypted file name
  return newfilepath;
}

// inputFile is the path-name of the file to be shredded
// Parity is a multiple of the number of shreds in the original file
// The % of shreds we can lose is = (Parity/(Parity+1))*100
function shredFile(parity, shredLength, inputFile) {
  const bitmap = fs.readFileSync(inputFile);
  const dataBuffer = new Buffer(bitmap);
  const shardLength = shredLength;
  const dataShards = Math.ceil(dataBuffer.length / shardLength);
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
  // writing data shards as files
  for (let i = 0; i < totalShards; i += i) {
    // Generate shred IDs to name the shreds
    fs.writeFileSync(`${i}_${Math.random()}`, buffer.slice(i * shardLength, (i + 1) * shardLength));
  }
}

// shredsBuffer: a Buffer containing the shreds to be recovered,
// targets: a variable containing the indecies of the missing shreds
// dataShreds: Math.ceil(dataBuffer.length / shardLength)
// recoverdFile: the name of the file to be recovered
function recoverFile(shredsBuffer, targets, parity, shredLength, dataShreds, recoveredFile) {
  const buffer = new Buffer(shredsBuffer);
  const shardLength = shredLength;
  const dataShards = dataShreds;
  const parityShards = parity * dataShards;
  const bufferOffset = 0;
  const totalShards = dataShards + parityShards;
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
  const restoredShreds = buffer.slice(bufferOffset, dataLength - 1);
  fs.writeFileSync(recoveredFile, restoredShreds);
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


export {
  createID,
  compress,
  decompress,
  shredFile,
  recoverFile,
  encrypt,
  decrypt,
  getFileList,
  createFileMap,
  getFileMap,
  syncFileMap,
  addFileMapEntry,
  removeFileMapEntry };
