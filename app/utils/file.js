import ReedSolomon from 'reed-solomon';
import fs from 'fs';

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


function updateFileMap(fileMapEntry) {
  // update local filemap

  const updatedFileMap = fileMapEntry + 1;
  return updatedFileMap;
}

export {
  createID,
  compress,
  decompress,
  shredFile,
  encrypt,
  decrypt,
  getFileList,
  updateFileMap };
