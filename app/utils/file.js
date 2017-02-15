
function createID() {
  return 0;
}

function getFileList() {
  return 0;
}

function compress(file) {
  // compress file with zlib
  const compressedFile = file + 0;

  return compressedFile;
}

function decompress(file) {
  // decompress file with zlib
  const decompressedFile = file + 0;

  return decompressedFile;
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

export { createID, compress, decompress, shred, encrypt, decrypt, getFileList, updateFileMap };
