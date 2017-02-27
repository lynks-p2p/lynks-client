import ReedSolomon from 'reed-solomon';
import crypto from 'crypto';
import zlib from 'zlib';
import ObjectID from 'bson-objectid';
import fs from 'fs';
var async = require('async');


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


function processFile(filepath,key, callback) {
  const algorithm = 'aes-256-ctr';
  const password = key;
  let newfilepath = `${filepath}_encrypted`; // can be edited later

  const gzip = zlib.createGzip();
  const encryptVar = crypto.createCipher(algorithm, password);
  const decompressedfile = fs.createReadStream(filepath);
  const writeFile = fs.createWriteStream(newfilepath);

  decompressedfile.pipe(gzip).pipe(encryptVar).pipe(writeFile);

  if (callback) {
    decompressedfile.on('end', callback);
  }
}

function gatherFile(filepath,key, callback) {
  const algorithm = 'aes-256-ctr';
  const password = key;


  const decryptVar = crypto.createDecipher(algorithm, password);
  const gunzip = zlib.createGunzip();

  const compressedEncrypt = fs.createReadStream(filepath);
  const writeFile = fs.createWriteStream('./_copy');

  compressedEncrypt.pipe(decryptVar).pipe(gunzip).pipe(writeFile);


}

function testing_CompEnc_DencryDeCom(filepath,CompEnc){
  //not working , but the case is that
  async.series
      ([
          function (callback)
          {
              processFile(filepath,"abrakadabra",callback)
          }
          ,
          function (callback)
          {
            gatherFile(CompEnc,"abrakadabra",callback)
          }

      ]
      ,
      function(err)
      {
        console.log("finished processing File then gathering File synchronously");
      });
}


 testing_CompEnc_DencryDeCom("./flash.jpg","./flash.jpg_encrypted")

// processFile("./card.jpg","abrakadabra",null)
// gatherFile("./card.jpg_encrypted","abrakadabra",null)

// processFile("./flash.jpg","abrakadabra",null)
// gatherFile("./flash.jpg_encrypted","abrakadabra",null)
