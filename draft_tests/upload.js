import { initHost,node } from '../app/utils/peer';
import {upload,download,readFileMap,syncFileMap } from '../app/utils/file';
import { signup,login } from '../app/utils/auth'

const myport = 1337;
const userName = 'gg';
const pin = '12345';

const seed = [
  Buffer.from('THISISTHEBESTBROKER!').toString('hex'),
  { hostname: '192.168.1.4', port: 1337 } //10.7.57.202
];
// console.log(require('buffer').kMaxLength);
//signup(userName, pin, (userID) => {
   login(userName, pin, (userID, err)=>{
     console.log('login complete!!!');
     initHost(myport, userID, seed, () => {
  //
  //     console.log('\tidentity is ' + node.router.identity.toString('hex'));
  //     console.log('initiating Upload .......');
  //
            upload('./Downloads/flash.jpg', (err)=>{
  // //
  // // //       if(err) console.log('upload Failed ! '+err);
  // // //       else console.log('upload Complete !');
         });
  //
  //   });
  // syncFileMap(()=>{});
   });
});
