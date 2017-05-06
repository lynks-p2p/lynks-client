import { initHost,node } from '../app/utils/peer';
import {upload,download,readFileMap } from '../app/utils/file';
import { signup,login } from '../app/utils/auth'

const myport = 8080;
const user_ID = 'YEHIA_HESHAM_SAIDAUC';
const pin = '12345';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: '10.40.47.118', port: 8080 } //10.7.57.202
];
// console.log(require('buffer').kMaxLength);
signup(user_ID, (userID) => {
  login(userID, pin, (err)=>{
    if(err){  return console.error(err);  }

    initHost(myport, userID, seed, () => {

      console.log('\tidentity is ' + node.router.identity.toString('hex'));
      console.log('==================> Initiating Download <==================');

      readFileMap((fileMap,error)=>{
        if(error) { return console.error(error);  }
        const fileMapSize = Object.keys(fileMap).length;
        const lastFileID = [Object.keys(fileMap)[fileMapSize-1]];
        download(lastFileID, (err)=>{
          if(err) console.log('Download Failed ! '+err);
          else console.log('Download Complete !\n\t ~~~ Check your Lynks Download Folder ~~~');

        });
      });
    });
  });
});
