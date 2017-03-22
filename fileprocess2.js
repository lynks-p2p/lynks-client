
import { fileToBuffer, bufferToFile, compress, decompress, encrypt, decrypt, shredFile, recoverFile } from './app/utils/file';

const NShreds = 10;
const parity = 2;
const key = '123key';
const input='Jon.mp4';
const output='jon_new.mp4';
const deadbytes = 6;

const processFile = (filename, callback) => {
  var shredIDs = [];
  fileToBuffer(filename, (loadedBuffer) => {
    compress(loadedBuffer, (compressedBuffer) => {
      encrypt(compressedBuffer, key, (encryptedBuffer) => {
        console.log(encryptedBuffer.length);
        shredFile(encryptedBuffer, NShreds, parity, (shreds) => {
          const saveShreds = (index, limit) => {
            var path = './pre_send/';
            shredIDs.push('shred_'+index);
            console.log(path+shredIDs[index]);
            bufferToFile(path + shredIDs[index], shreds[index], () => {
              if (index < limit - 1) saveShreds(index + 1, limit);
              else {
                console.log('SUCCESS.');
                callback(shredIDs, path);
              }
            });
          };

          const limit = shreds.length;

          saveShreds(0, limit);
        });
      });
    });
  });
};

function createShredList (NShreds, parity){
const shredsList = [];
for (let i = 0; i < NShreds * (parity + 1); i++) {
  shredsList.push('/pre_store/shred_'+i);
  }
  return shredsList;
}
const gatherFile = (shredsPaths, callback) => {
  let buffer = new Buffer([]);

  const readShreds = (index, limit, callback2) => {
    fileToBuffer(shredsPaths[index], (data) => {
      buffer = Buffer.concat([buffer, data]);
      if (index < limit - 1) readShreds(index + 1, limit, callback2);
      else {
        callback2();
      }
    });
  };

  const limit = shredsList.length;

  readShreds(0, limit, () => {
    recoverFile(buffer, 0, parity, NShreds, (loadedBuffer) => {
      console.log(loadedBuffer.length);
      const loadedBuffer2 = loadedBuffer.slice(0, loadedBuffer.length - deadbytes);
      decrypt(loadedBuffer2, key, (decryptedBuffer) => {
        decompress(decryptedBuffer, (decompressedBuffer) => {
          bufferToFile(output, decompressedBuffer, () => {
            console.log('Success!');
            callback();
          });
        });
      });
    });
  });

  // fileToBuffer(filename, (loadedBuffer) => {
  //   decrypt(loadedBuffer, '123key', (decryptedBuffer) => {
  //     decompress(decryptedBuffer, (decompressedBuffer) => {
  //       bufferToFile('flash_new.jpg', decompressedBuffer, () => {
  //         console.log('Success!');
  //         callback();
  //       });
  //     });
  //   });
  // });
};

// processFile(input, () => {
//   console.log('SUCCESS');
// //
//   // gatherFile('flash.jpg.shred', () => {
//   //   console.log('BAZINGA.');
//   // });
// });

/*gatherFile(shredsList, () => {
  console.log('BAZINGA.');
});*/

//
// compress('flash.jpg', () => {
//   encrypt('flash.jpg.Gzip', '123key', () => {
//     decrypt('flash.jpg_encrypted', '123key', () => {
//       decompress('flash.jpg_decrypted');
//     });
//   });
// });
export {
  processFile,
  gatherFile,
}
