
function createID() {
  return 0;
}

function getFileList() {
  return 0;
}



  function compress(decompressedfilename,compressedfilename, callback) {
  // compress file with zlib
  console.log("started compression");
  const zlib = require('zlib');
  const gzip = zlib.createGzip();
  const fs = require('fs');
  const decompressedfile = fs.createReadStream(decompressedfilename);
  const compressedfile = fs.createWriteStream(compressedfilename);
  decompressedfile.pipe(gzip).pipe(compressedfile);
  console.log("Done compressing");

  if (callback) {
         decompressedfile.on('end', callback);
   }
  return compressedfile;
}

  function decompress(compressedfilename,decompressedfilename, callback) {
  // decompress file with zlib
    console.log("started decompression");
  const zlib = require('zlib');
  const gunzip = zlib.createGunzip();
  const fs = require('fs');
  const compressedfile = fs.createReadStream(compressedfilename);
  const decompressedfile = fs.createWriteStream(decompressedfilename);
  compressedfile.pipe(gunzip).pipe(decompressedfile);
  console.log("Done decompressing");
  if (callback) {
       compressedfile.on('end', callback);
   }
  return decompressedfile;
}

function encrypt(file, key) {
  return file + key;
}

function decrypt(file, key) {
  return file - key;
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
