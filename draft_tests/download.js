/* eslint-disable */

import { initHost,node } from '../app/utils/peer';
import {upload,download,readFileMap } from '../app/utils/file';
import { signup,login } from '../app/utils/auth'

const myport = 1337;
const userName = 'CHOUAIB';
const pin = '12345';

const seed = [
  Buffer.from('THISISTHEBESTBROKER!').toString('hex'),
  { hostname: '192.168.1.5', port: 1337 } //10.7.57.202
];

export function singupCall (callback) {
  login(userName, pin, (userID,err)=>{
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
          else {
            console.log('Download Complete !\n\t ~~~ Check your Lynks Download Folder ~~~');
            callback();
          }
        });
      });
    });
  });
}
