import crypto from 'crypto';
import zlib from 'zlib';
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
    newfilepath = `${filepath.substr(0, filepath.length - 10)}_copy`;
  } else {
    newfilepath = `${filepath}_copy`;
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

export {
  createID,
  compress,
  decompress,
  shred,
  encrypt,
  decrypt,
  getFileList,
  updateFileMap };
