var crypto = require('crypto');
const zlib = require('zlib');
const fs = require('fs');
function createID() {
  return 0;
}

function getFileList() {
  return 0;
}



  function compress(filepath, callback) {
  // compress file with zlib
  console.log("started compression");
  const gzip = zlib.createGzip();
  var decompressedfile = fs.createReadStream(filepath);
  var compressedfile = fs.createWriteStream(filepath+".Gzip");
  decompressedfile.pipe(gzip).pipe(compressedfile);
  if (callback) {
         decompressedfile.on('end', callback);
   }
   console.log("Done compressing");
}

  function decompress(filepath, callback) {
  // decompress file with zlib
  console.log("started decompression");
  const gunzip = zlib.createGunzip();
  var compressedfile = fs.createReadStream(filepath+"_decrypted");
  var decompressedfile = fs.createWriteStream(filepath+"_copy");
  compressedfile.pipe(gunzip).pipe(decompressedfile);
  fs.unlinkSync(filepath+"_decrypted");
  if (callback) {
       compressedfile.on('end', callback);
   }
  console.log("Done decompressing");
}

function encrypt(filepath, key, callback) {
  console.log("starting encryption");
  var  algorithm = 'aes-256-ctr';
  var password = key;
  var encrypt = crypto.createCipher(algorithm, password);
  var compressedfile_read = fs.createReadStream(filepath+".Gzip");
  var compressedfile_write = fs.createWriteStream(filepath+"_encrypted");
  compressedfile_read.pipe(encrypt).pipe(compressedfile_write);
  fs.unlinkSync(filepath+".Gzip");
  if (callback) {
        compressedfile_read.on('end', callback);
    }
  console.log("done encrypting");
  return encrypt;
}

function decrypt(filepath, key, callback) {
  console.log("starting decryption");
  var  algorithm = 'aes-256-ctr';
  var password = key;
  var decrypt = crypto.createDecipher(algorithm, password);
  var compressedfile_read = fs.createReadStream(filepath+"_encrypted");
  var compressedfile_write = fs.createWriteStream(filepath+"_decrypted");
  compressedfile_read.pipe(decrypt).pipe(compressedfile_write);
  fs.unlinkSync(filepath+"_encrypted");
  if (callback) {
        compressedfile_read.on('end', callback);
    }
  console.log("done decrypting");
  return decrypt;
}

function shred(file) {
  // erasure coding with reed solomon
  const shreds = file;

  return shreds;
}

function updateFileMap(fileMapEntry) {
  // update local filemap

  const updatedFileMap = fileMapEntry + 1;
  return updatedFileMap;
}

 module.exports =  { createID, compress, decompress, shred, encrypt, decrypt, getFileList, updateFileMap };
