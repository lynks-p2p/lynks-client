/* eslint-disable */

import { initHost,node } from './app/utils/peer';
import { upload,download,readFileMap, createFileMap, encryptFileMap } from './app/utils/file';
import { signup,login, setFileMapKey } from './app/utils/auth'
import {encryptedFileMapPath} from './app/utils/ENV_variables';
import { generateFileMapKey }  from  './app/utils/keys_ids';
const myport = 1337;
const user_ID = 'YEHIA_HESHAM_SAIDAUC';
const pin = '12345';

const seed = [
  Buffer.from('ISTHISEVENABROKERYO?').toString('hex'),
  { hostname: '192.168.1.6', port: 8080 } //10.7.57.202
];
// console.log(require('buffer').kMaxLength);
export function loginCall(callback){
  createFileMap(()=>{
    console.log("1");
    generateFileMapKey(user_ID, pin, (fileMapKey) => { //generate the fileMapKey'
    console.log("Inside upload.js - before setFileMapKey: ");
    console.log(encryptedFileMapPath);
    setFileMapKey(fileMapKey);
    encryptFileMap(encryptedFileMapPath,()=>{
      signup(user_ID, (userID) => {
        login(userID, pin, (err)=>{
          if(err){  return console.error(err);  }
          initHost(myport, userID, seed, () => {

            console.log('\tidentity is ' + node.router.identity.toString('hex'));
            console.log('initiating Upload .......');

            upload('/home/chouaib/Lynks/lynks-client/Storage/VayneFeed.png', (err)=>{
              if(err) console.log('upload Failed ! '+err);
              else {
                console.log('upload Complete !');
                callback();
              }
              });

            });
          });
        });
      })
    });
  })
}
