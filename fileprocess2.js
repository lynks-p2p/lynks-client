import { compress, decompress, encrypt, decrypt } from './app/utils/file';

compress('flash.jpg', () => {
  encrypt('flash.jpg.Gzip', '123key', () => {
    decrypt('flash.jpg_encrypted', '123key', () => {
      decompress('flash.jpg_decrypted');
    });
  });
});
