import { initHost,node } from '../app/utils/peer';
import {upload,download,readFileMap } from '../app/utils/file';
import { signup,login } from '../app/utils/auth'

const myport = 1337;
const user_ID = 'YEHIA_HESHAM_SAIDAUC';
const pin = '12345';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: '10.40.116.75', port: 2345 } //10.7.57.202
];
// console.log(require('buffer').kMaxLength);
signup(user_ID, (userID) => {
  login(userID, pin, ()=>{
    initHost(myport, userID, seed, () => {

      console.log('\tidentity is ' + node.router.identity.toString('hex'));
      console.log('initiating Download .......');

      readFileMap((fileMap)=>{
        const fileMapSize = Object.keys(fileMap).length;
        const lastFileID = [Object.keys(fileMap)[fileMapSize-1]];
        console.log(lastFileID);
        download(lastFileID, (err)=>{
          if(err) console.log('Download Failed ! '+err);
          else console.log('Download Complete ! ~~~ Check your Lynks Download Folder ~~~');

        });
      });
    });
  });
});
