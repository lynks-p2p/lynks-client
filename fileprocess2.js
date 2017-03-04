
import fs from 'fs';
import { fileToBuffer, bufferToFile, compress, decompress, encrypt, decrypt } from './app/utils/file';


fileToBuffer('flash.jpg', (loadedBuffer) => {
  compress(loadedBuffer, (compressedBuffer) => {
    encrypt(compressedBuffer, '123key', (encryptedBuffer) => {
      decrypt(encryptedBuffer, '123key', (decryptedBuffer) => {
        decompress(decryptedBuffer, (decompressedBuffer) => {
          bufferToFile('flash_new.jpg', decompressedBuffer, () => {
            console.log('Success!');
          });
        });
      });
    });
  });
});
//
// compress('flash.jpg', () => {
//   encrypt('flash.jpg.Gzip', '123key', () => {
//     decrypt('flash.jpg_encrypted', '123key', () => {
//       decompress('flash.jpg_decrypted');
//     });
//   });
// });
