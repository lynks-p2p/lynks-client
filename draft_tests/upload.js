/* eslint-disable */

import { initHost,node } from '../app/utils/peer';
import { upload,download,readFileMap } from '../app/utils/file';
import { signup,login } from '../app/utils/auth'

const myport = 1337;
const userName = 'CHOUAIB';
const pin = '12345';

const seed = [
  Buffer.from('THISISTHEBESTBROKER!').toString('hex'),
  { hostname: '192.168.1.5', port: 1337 } //10.7.57.202
];

// console.log(require('buffer').kMaxLength);
export function loginCall(callback){
  signup(userName, pin, (userID) => {
    login(userName, pin, (userID, err)=>{
      //if(err){  return console.error(err);  }
      initHost(myport, userID, seed, () => {

        console.log('\tidentity is ' + node.router.identity.toString('hex'));
        console.log('==================> Initiating Upload <==================');

        upload('/home/chouaib/Lynks/lynks-client/Storage/Velkoz_Penta.jpg', (err)=>{
          if(err) console.log('upload Failed ! '+err);
          else {
            console.log('Upload Complete !');
            callback();
          }
        });
      });
    });
  });
}
//
// loginCall(() => {
//   console.log('SUCCESS.')
// })
