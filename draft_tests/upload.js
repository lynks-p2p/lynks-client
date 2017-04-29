import { initHost,node } from '../app/utils/peer';
import {upload,download,readFileMap } from '../app/utils/file';
import { signup } from '../app/utils/auth'

const myport = 1337;
const networkID = 'YEHIA_HESHAM_SAIDAUC';
const userID = 'james';
const pin = '12345';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: '10.40.116.75', port: 2345 } //10.7.57.202
];
// console.log(require('buffer').kMaxLength);
// signup(userID, pin, () => {
  // console.log('finish signup');
  initHost(myport, networkID, seed, () => {
    console.log('identity is ' + node.router.identity.toString('hex'));
    upload('/home/yehia/Desktop/auc.jpg', (err)=>{
      if(err) console.log('upload Failed ! '+err);
      else console.log('upload Complete !');
    });
  });
// });
