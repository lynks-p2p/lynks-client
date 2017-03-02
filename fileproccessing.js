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

function encrypt(buffer, key, callback) {
  const algorithm = 'aes-256-ctr';
  const password = key;
  const encryptVar = crypto.createCipher(algorithm, password);
  var crypted = Buffer.concat([encryptVar.update(buffer),encryptVar.final()]);
  return callback(crypted);
}

function decrypt(buffer, key, callback) {
  const algorithm = 'aes-256-ctr';
  const password = key;
  const decryptVar = crypto.createDecipher(algorithm, password);
  var dec = Buffer.concat([decryptVar.update(buffer) , decryptVar.final()]);
  return callback(dec);
}

function shredFile(parity, shredLength, inputBuffer,callback) {
  // inputFile is the path-name of the file to be shredded
  // Parity is a multiple of the number of shreds in the original file
  // The % of shreds we can lose is = (Parity/(Parity+1))*100

  const dataBuffer = inputBuffer;
  const shardLength = shredLength;
  const dataShards = Math.ceil(dataBuffer.length / shardLength);
  console.log("dataShards lenght is ", dataShards);

  const parityShards = parity * dataShards;
  console.log("parityShards lenght is ", parityShards);

  const totalShards = dataShards + parityShards;
  console.log("totalShards lenght is ", totalShards);

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
  // Generate shred IDs to name the shreds
  var outputarray=[];
  for (let i = 0; i < totalShards; i += 1) {
    var t=`${i}_${Math.random()}.shred`
    outputarray.push(t)
    fs.writeFileSync(t, buffer.slice(i * shardLength, (i + 1) * shardLength));
  }
  return callback(outputarray);
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

function processFile(filepath,key,parity,shredLength,callback){
  //read file into buffer
  const fileBuffer = fs.readFileSync(filepath);

  // var c = compress(filepath, () => {
   encrypt(fileBuffer, key, (e) => {
     //shred file here
     shredFile(parity, shredLength, e,(arr) => {
       console.log("finished shreding");
        return callback(arr);
     })
    //  return callback();
   });
 // });
}

function gatherFile(shreds_files,key,targets,parity,shredLength,recoveredFile,callback){

  var shredsBuffer= fs.readFileSync(shreds_files[0]);
  var t;

  for (var i = 1; i < shreds_files.length; i++) {
    t=fs.readFileSync(shreds_files[i]);
    Buffer.concat([shredsBuffer,t],t.length+shredsBuffer.length);
  }
  console.log('size of concat. buffer is ',shredsBuffer.length);

  const dataShreds=2;

  decrypt(shredsBuffer, key, (d) => {
      // decompress(d, () => {
      recoverFile(d, targets, parity, shredLength, dataShreds, recoveredFile);
        callback();
      // });
    });
}

const parity=3;
const shredLength=86283;
const target=0;
const key='123key';
const inputFile="flash2.jpg";
const recoveredFile="My_recoveredFile";

processFile(inputFile,key,parity,shredLength,function(shreds_files){
  gatherFile(shreds_files,key,target,parity,shredLength,recoveredFile);
});
