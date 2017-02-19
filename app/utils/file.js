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
  const gzip = zlib.createGzip();
  var newfilepath = filepath+".Gzip";
  var decompressedfile = fs.createReadStream(filepath);
  var compressedfile = fs.createWriteStream(newfilepath);
  decompressedfile.pipe(gzip).pipe(compressedfile);
  if (callback) {
         decompressedfile.on('end', callback);
   }
   return newfilepath;  //return compressed file name
}

  function decompress(filepath, callback) {
  // decompress file with zlib
  const gunzip = zlib.createGunzip();
  var newfilepath;
  if(filepath.indexOf("_decrypted") > -1) {
      newfilepath = filepath.substr(0,filepath.length-10)+"_copy";
}
  else newfilepath = filepath+"_copy";
  var compressedfile = fs.createReadStream(filepath);
  var decompressedfile = fs.createWriteStream(newfilepath);
  compressedfile.pipe(gunzip).pipe(decompressedfile);
  fs.unlinkSync(filepath);
  if (callback) {
       compressedfile.on('end', callback);
   }
  return newfilepath;   //return decompressed file name
}

function encrypt(filepath, key, callback) {
  var  algorithm = 'aes-256-ctr';
  var password = key;
  var newfilepath;
  if(filepath.indexOf(".Gzip") > -1) {
      newfilepath = filepath.substr(0,filepath.length-5)+"_encrypted";
}
  else newfilepath = filepath+"_encrypted";
  var encrypt = crypto.createCipher(algorithm, password);
  var compressedfile_read = fs.createReadStream(filepath);
  var compressedfile_write = fs.createWriteStream(newfilepath);
  compressedfile_read.pipe(encrypt).pipe(compressedfile_write);
  fs.unlinkSync(filepath);
  if (callback) {
        compressedfile_read.on('end', callback);
    }
  return newfilepath;   //return encrypted file name
}

function decrypt(filepath, key, callback) {
  var  algorithm = 'aes-256-ctr';
  var password = key;
  var newfilepath;
  if(filepath.indexOf("_encrypted") > -1) {
      newfilepath = filepath.substr(0,filepath.length-10)+"_decrypted";
}
  else newfilepath = filepath+"_decrypted";
  var decrypt = crypto.createDecipher(algorithm, password);
  var compressedfile_read = fs.createReadStream(filepath);
  var compressedfile_write = fs.createWriteStream(newfilepath);
  compressedfile_read.pipe(decrypt).pipe(compressedfile_write);
  fs.unlinkSync(filepath);
  if (callback) {
        compressedfile_read.on('end', callback);
    }
  return newfilepath;   //return decrypted file name
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
