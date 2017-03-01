import ReedSolomon from 'reed-solomon';
import crypto from 'crypto';
import zlib from 'zlib';
import ObjectID from 'bson-objectid';
var async = require('async');


import fs from 'fs';


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
    newfilepath = `${filepath.substr(0, filepath.length - 10)} (copy)`;
  } else {
    newfilepath = `${filepath} (copy)`;
  }
  const compressedfile = fs.createReadStream(filepath);
  const decompressedfile = fs.createWriteStream(newfilepath);
  compressedfile.pipe(gunzip).pipe(decompressedfile);
  if (callback) {
    compressedfile.on('end', callback);
    fs.unlinkSync(filepath);
  }

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

  if (callback) {
    compressedfileRead.on('end', callback);
    fs.unlinkSync(filepath);
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

  if (callback) {
    compressedfileRead.on('end', callback);
    fs.unlinkSync(filepath);
  }
  // return decrypted file name

  return newfilepath;
}

function shredFile(parity, shredLength, inputFile) {
  // inputFile is the path-name of the file to be shredded
  // Parity is a multiple of the number of shreds in the original file
  // The % of shreds we can lose is = (Parity/(Parity+1))*100

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

function processFile(filepath,key,callback){
  var c = compress(filepath, () => {
  var e =  encrypt(c, key, () => {
     //shred file here
     return callback(e);
   });
 });
}

function gatherFile(filepath,key,callback){
  var d = decrypt(filepath, key, () => {
      decompress(d, () => {
        //recover file here
        callback();
      });
    });
}


processFile("flash.jpg",'123key',  function(response){
  gatherFile(response,'123key', () =>{});
});
